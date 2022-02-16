var Q = require('q');
var mout = require('mout');
var semver = require('semver');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var promptly = require('promptly');
var PackageRepository = require('./PackageRepository');
var copy = require('../util/copy');
var createError = require('../util/createError');
var endpointParser = require('../util/endpointParser');

function Manager(config, logger) {
    this._config = config;
    this._logger = logger;
    this._repository = new PackageRepository(this._config, this._logger);

    this.setResolutions();
    this.configure();
}

// -----------------

Manager.prototype.setProduction = function (production) {
    this._production = production;
    return this;
};

Manager.prototype.getResolutions = function () {
    return this._resolutions;
};

Manager.prototype.setResolutions = function (resolutions, save) {
    this._resolutions = resolutions || {};
    this._saveResolutions = !!save;
    return this;
};

Manager.prototype.configure = function (targets, resolved, installed) {
    // If working, error out
    if (this._working) {
        throw createError('Can\'t configure while working', 'EWORKING');
    }

    targets = targets || [];
    this._targets = targets;
    this._resolved = {};
    this._installed = {};

    // Parse targets
    targets.forEach(function (decEndpoint) {
        decEndpoint.dependants = mout.object.values(decEndpoint.dependants);
    }, this);

    // Parse resolved
    mout.object.forOwn(resolved, function (decEndpoint, name) {
        decEndpoint.dependants = mout.object.values(decEndpoint.dependants);
        this._resolved[name] = [decEndpoint];
        this._installed[name] = decEndpoint.pkgMeta;
    }, this);

    // Parse installed
    mout.object.mixIn(this._installed, installed);

    return this;
};

Manager.prototype.resolve = function () {
    // If already resolving, error out
    if (this._working) {
        return Q.reject(createError('Already working', 'EWORKING'));
    }

    // Reset stuff
    this._fetching = {};
    this._nrFetching = 0;
    this._failed = {};
    this._conflicted = {};
    this._hasFailed = false;
    this._deferred = Q.defer();

    // If there's nothing to resolve, simply dissect
    if (!this._targets.length) {
        process.nextTick(this._dissect.bind(this));
    // Otherwise, fetch each target from the repository
    // and let the process roll out
    } else {
        this._targets.forEach(this._fetch.bind(this));
    }

    // Unset working flag when done
    return this._deferred.promise
    .fin(function () {
        this._working = false;
    }.bind(this));
};

Manager.prototype.install = function () {
    var destDir;
    var that = this;

    // If already resolving, error out
    if (this._working) {
        return Q.reject(createError('Already working', 'EWORKING'));
    }

    destDir = path.join(this._config.cwd, this._config.directory);
    return Q.nfcall(mkdirp, destDir)
    .then(function () {
        var promises = [];

        mout.object.forOwn(that._dissected, function (decEndpoint, name) {
            var promise;
            var dest;
            var release = decEndpoint.pkgMeta._release;
            var data = that._toData(decEndpoint);

            that._logger.action('install', name + (release ? '#' + release : ''), data);

            // Remove existent and copy canonical package
            dest = path.join(destDir, name);
            promise = Q.nfcall(rimraf, dest)
            .then(copy.copyDir.bind(copy, decEndpoint.canonicalPkg, dest))
            .fail(function (err) {
                err.data = err.data;
                throw err;
            });

            promises.push(promise);
        });

        return Q.all(promises);
    })
    .then(function () {
        return mout.object.map(that._dissected, function (decEndpoint) {
            var data = this._toData(decEndpoint);
            data.dependencies = mout.object.map(decEndpoint.dependencies, this._toData, this);
            return data;
        }, that);
    })
    .fin(function () {
        this._working = false;
    }.bind(this));
};

Manager.prototype.areCompatible = function (first, second) {
    var validFirst = semver.valid(first) != null;
    var validSecond = semver.valid(second) != null;
    var validRangeFirst;
    var validRangeSecond;
    var rangeSecond;
    var rangeFirst;

    // Version -> Version
    if (validFirst && validSecond) {
        return semver.eq(first, second);
    }

    // Range -> Version
    validRangeFirst = semver.validRange(first) != null;
    if (validRangeFirst && validSecond) {
        return semver.satisfies(second, first);
    }

    // Version -> Range
    validRangeSecond = semver.validRange(second) != null;
    if (validFirst && validRangeSecond) {
        return semver.satisfies(first, second);
    }

    // Range -> Range
    if (validRangeFirst && validRangeSecond) {
        // Special case which both targets are *
        if (first === '*' && second === '*') {
            return true;
        }

        rangeFirst = {};
        rangeSecond = {};

        // Grab the highest possible for both
        rangeFirst.max = this._getCap(semver.toComparators(first), 'highest');
        rangeSecond.max = this._getCap(semver.toComparators(second), 'highest');

        // Grab the lowest possible for both
        rangeFirst.min = this._getCap(semver.toComparators(first), 'lowest');
        rangeSecond.min = this._getCap(semver.toComparators(second), 'lowest');

        // Check if the highest/lowest resolvable version for the second is the
        // same as the first one
        return semver.eq(rangeFirst.max.version, rangeSecond.max.version) &&
               rangeFirst.max.comparator === rangeSecond.max.comparator &&
               semver.eq(rangeFirst.min.version, rangeSecond.min.version) &&
               rangeFirst.min.comparator === rangeSecond.min.comparator;
    }

    // As fallback, check if both are the equal
    return first === second;
};

// -----------------

Manager.prototype._fetch = function (decEndpoint) {
    var name = decEndpoint.name;

    // Check if the whole process started to fail fast
    if (this._hasFailed) {
        return;
    }

    // Mark as being fetched
    this._fetching[name] = this._fetching[name] || [];
    this._fetching[name].push(decEndpoint);
    this._nrFetching++;

    // Fetch it from the repository
    // Note that the promise is stored in the decomposed endpoint
    // because it might be reused if a similar endpoint needs to be resolved
    return decEndpoint.promise = this._repository.fetch(decEndpoint)
    // When done, call onFetchSuccess
    .spread(this._onFetchSuccess.bind(this, decEndpoint))
    // If it fails, call onFetchFailure
    // Note that any sync error that happens on the _onFetchSuccess
    // will cause this function to be called
    .fail(this._onFetchError.bind(this, decEndpoint));
};

Manager.prototype._onFetchSuccess = function (decEndpoint, canonicalPkg, pkgMeta) {
    var name;
    var resolved;
    var index;
    var initialName = decEndpoint.name;

    // Remove from being fetched list
    mout.array.remove(this._fetching[initialName], decEndpoint);
    this._nrFetching--;

    // Store some needed stuff
    decEndpoint.name = name = decEndpoint.name || pkgMeta.name;
    decEndpoint.canonicalPkg = canonicalPkg;
    decEndpoint.pkgMeta = pkgMeta;
    delete decEndpoint.promise;

    // If the fetched endpoint target is '*' and it resolved to a version,
    // adjust the target
    if (decEndpoint.target === '*' && decEndpoint.pkgMeta.version) {
        decEndpoint.target = '~' + decEndpoint.pkgMeta.version;
    }

    // Add to the resolved list, marking it as resolved
    // If there's an exact equal endpoint, replace instead of adding
    resolved = this._resolved[name] = this._resolved[name] || [];
    index = mout.array.findIndex(resolved, function (resolved) {
        return resolved.target === decEndpoint.target;
    });
    if (index !== -1) {
        decEndpoint.dependants.push.apply(decEndpoint.dependants, resolved[index].dependants);
        resolved.splice(index, 1);
    }
    resolved.push(decEndpoint);

    // If the fetched endpoint had no name, we need to remove the initially
    // resolved one that match the new name
    if (!initialName) {
        index = mout.array.findIndex(resolved, function (decEndpoint) {
            return decEndpoint.initial;
        });

        if (index !== -1) {
            resolved.splice(index, 1);
        }
    }

    // Progress!
    this._deferred.notify(decEndpoint);

    // Parse dependencies
    this._parseDependencies(decEndpoint, pkgMeta, 'dependencies');
    // Do the same for the dev dependencies
    if (!this._production) {
        this._parseDependencies(decEndpoint, pkgMeta, 'devDependencies');
    }

    // If the resolve process ended, parse the resolved packages
    // to find the most suitable version for each package
    if (this._nrFetching <= 0) {
        process.nextTick(this._dissect.bind(this));
    }
};

Manager.prototype._onFetchError = function (decEndpoint, err) {
    var name = decEndpoint.name;

    err.data = err.data || {};
    err.data.endpoint = mout.object.pick(decEndpoint, ['name', 'source', 'target']);

    // Remove from being fetched list
    mout.array.remove(this._fetching[name], decEndpoint);
    this._nrFetching--;

    // Add to the failed list
    this._failed[name] = this._failed[name] || [];
    this._failed[name].push(err);
    delete decEndpoint.promise;

    // Make the whole process to fail fast
    this._failFast();

    // If the resolve process ended, parse the resolved packages
    // to find the most suitable version for each package
    if (this._nrFetching <= 0) {
        process.nextTick(this._dissect.bind(this));
    }
};

Manager.prototype._failFast = function () {
    if (this._hasFailed) {
        return;
    }

    this._hasFailed = true;

    // If after 20 seconds all pending tasks haven't finished,
    // we force the process to end
    this._failFastTimeout = setTimeout(function () {
        this._nrFetching = Infinity;
        this._dissect();
    }.bind(this), 20000);
};

Manager.prototype._parseDependencies = function (decEndpoint, pkgMeta, jsonKey) {
    decEndpoint.dependencies = decEndpoint.dependencies || {};

    // Parse package dependencies
    mout.object.forOwn(pkgMeta[jsonKey], function (value, key) {
        var resolved;
        var beingFetched;
        var compatible;
        var childDecEndpoint = endpointParser.json2decomposed(key, value);

        decEndpoint.dependencies[key] = childDecEndpoint;
        childDecEndpoint.dependants = childDecEndpoint.dependants || [];
        childDecEndpoint.dependants.push(decEndpoint);

        // Check if a compatible one is already resolved
        // If there's one, we don't need to resolve it twice
        resolved = this._resolved[key];
        if (resolved) {
            // Find compatible
            compatible = mout.array.find(resolved, function (resolved) {
                return this.areCompatible(resolved.target, childDecEndpoint.target);
            }, this);

            if (compatible) {
                // If the compatible's target is equal, do not add to the resolved
                if (compatible.target === childDecEndpoint.target) {
                    compatible.dependants.push(decEndpoint);
                } else {
                    childDecEndpoint.canonicalPkg = compatible.canonicalPkg;
                    childDecEndpoint.pkgMeta = compatible.pkgMeta;
                    this._resolved[key].push(childDecEndpoint);
                }
                return;
            }
        }

        // Check if a compatible one is being fetched
        // If there's one, we reuse it to avoid resolving it twice
        beingFetched = this._fetching[key];
        if (beingFetched) {
            // Find compatible
            compatible = mout.array.find(beingFetched, function (beingFetched) {
                return this.areCompatible(beingFetched.target, childDecEndpoint.target);
            }, this);

            // Wait for it to resolve and then add it to the resolved packages
            if (compatible) {
                // If the compatible's target is equal, do not add to the resolved
                if (compatible.target === childDecEndpoint.target) {
                    compatible.dependants.push(decEndpoint);
                } else {
                    compatible.promise.then(function () {
                        childDecEndpoint.canonicalPkg = compatible.canonicalPkg;
                        childDecEndpoint.pkgMeta = compatible.pkgMeta;
                        this._resolved[key].push(childDecEndpoint);
                    }.bind(this));
                }
                return;
            }
        }

        // Otherwise, just fetch it from the repository
        this._fetch(childDecEndpoint);
    }, this);
};

Manager.prototype._dissect = function () {
    var err;
    var promise = Q.resolve();
    var suitables = {};
    var that = this;

    // If something failed, reject the whole resolve promise
    // with the first error
    if (this._hasFailed) {
        clearTimeout(this._failFastTimeout); // Cancel fail fast timeout

        err = mout.object.values(this._failed)[0][0];
        this._deferred.reject(err);
        return;
    }

    mout.object.forOwn(this._resolved, function (decEndpoints, name) {
        var semvers;
        var nonSemvers;

        // Filter semver ones
        semvers = decEndpoints.filter(function (decEndpoint) {
            return !!decEndpoint.pkgMeta.version;
        });

        // Sort semver ones DESC
        semvers.sort(function (first, second) {
            return semver.rcompare(first, second);
        });

        // Filter non-semver ones
        nonSemvers = decEndpoints.filter(function (decEndpoint) {
            return !decEndpoint.pkgMeta.version;
        });

        promise = promise.then(function () {
            return that._electSuitable(name, semvers, nonSemvers)
            .then(function (suitable) {
                suitables[name] = suitable;
            });
        });
    }, this);

    promise
    .then(function () {
        // Look for extraneous resolutions
        mout.object.forOwn(this._resolutions, function (resolution, name) {
            if (this._conflicted[name]) {
                return;
            }

            if (this._saveResolutions) {
                this._logger.info('resolution', 'Removed unnecessary ' + name + '#' + resolution + ' resolution', {
                    name: name,
                    resolution: resolution,
                    action: 'delete'
                });
                delete this._resolutions[name];
            } else {
                this._logger.warn('resolution', 'Unnecessary ' + name + '#' + resolution + ' resolution', {
                    name: name,
                    resolution: resolution
                });
            }
        }, this);

        // Filter only packages that need to be installed
        this._dissected = mout.object.filter(suitables, function (decEndpoint, name) {
            var installedMeta = this._installed[name];
            return !installedMeta || installedMeta._release !== decEndpoint.pkgMeta._release;
        }, this);

        return mout.object.map(this._dissected, function (decEndpoint) {
            var data = this._toData(decEndpoint);
            data.dependencies = mout.object.map(decEndpoint.dependencies, this._toData, this);
            return data;
        }, this);
    }.bind(this))
    .then(this._deferred.resolve, this._deferred.reject);
};

Manager.prototype._electSuitable = function (name, semvers, nonSemvers) {
    var suitable;
    var resolution;
    var unresolvable;
    var dataPicks;
    var choices;
    var picks = [];

    // If there are both semver and non-semver, there's no way
    // to figure out the suitable one
    if (semvers.length && nonSemvers.length) {
        picks.push.apply(picks, semvers);
        picks.push.apply(picks, nonSemvers);
    // If there are only non-semver ones, the suitable is elected
    // only if there's one
    } else if (nonSemvers.length) {
        if (nonSemvers.length === 1) {
            return Q.resolve(nonSemvers[0]);
        }

        picks.push.apply(picks, nonSemvers);
    // If there are only semver ones, figure out the which one
    // is compatible with every requirement
    } else {
        suitable = mout.array.find(semvers, function (subject) {
            return semvers.every(function (decEndpoint) {
                return semver.satisfies(subject.pkgMeta.version, decEndpoint.target);
            });
        });

        if (suitable) {
            return Q.resolve(suitable);
        }

        picks.push.apply(picks, semvers);
    }

    // At this point, there's a conflict
    this._conflicted[name] = true;

    // Sort picks by version/release
    picks.sort(function (pick1, pick2) {
        var version1 = pick1.pkgMeta.version;
        var version2 = pick2.pkgMeta.version;
        var comp;

        // If both have versions, compare their versions using semver
        if (version1 && version2) {
            comp = semver.compare(version1, version2);
            if (!comp) {
                return comp;
            }
        } else {
            // Give priority to the one that is a version
            if (version1) {
                return -1;
            }
            if (version2) {
                return 1;
            }
        }

        // Give priority to the one with most dependants
        if (pick1.dependants.length > pick2.dependants.length) {
            return -1;
        }
        if (pick1.dependants.length < pick2.dependants.length) {
            return 1;
        }

        return 0;
    });

    // Prepare data to be sent bellow
    dataPicks = picks.map(function (pick) {
        var dataPick = this._toData(pick);
        dataPick.dependants = pick.dependants.map(this._toData.bind(this), this);
        return dataPick;
    }, this);

    // Check if there's a resolution that resolves the conflict
    // Note that if a target is marked as unresolvable, the resolution has
    // no effect
    resolution = this._resolutions[name];
    unresolvable = mout.object.find(this._targets, function (target) {
        return target.name === name && target.unresolvable;
    });

    if (resolution && !unresolvable) {
        if (semver.valid(resolution) != null || semver.validRange(resolution) != null) {
            suitable = mout.array.findIndex(picks, function (pick) {
                return semver.satisfies(pick.pkgMeta.version, resolution);
            });
        } else {
            suitable = mout.array.findIndex(picks, function (pick) {
                return pick.pkgMeta._release === resolution;
            });
        }

        if (suitable === -1) {
            this._logger.warn('resolution', 'Unsuitable resolution declared for ' + name + ': ' + resolution, {
                name: name,
                picks: dataPicks,
                resolution: resolution
            });
        } else {
            this._logger.conflict('solved', 'Unable to find suitable version for ' + name, {
                name: name,
                picks: dataPicks,
                resolution: resolution,
                suitable: dataPicks[suitable]
            });
            return Q.resolve(picks[suitable]);
        }
    }

    // If interactive is disabled, error out
    if (!this._config.interactive) {
        throw createError('Unable to find suitable version for ' + name, 'ECONFLICT', {
            name: name,
            picks: dataPicks
        });
    }

    // At this point the user needs to make a decision
    this._logger.conflict('incompatible', 'Unable to find suitable version for ' + name, {
        name: name,
        picks: dataPicks,
        saveResolutions: this._saveResolutions
    });

    choices = picks.map(function (pick, index) { return index + 1; });
    return Q.nfcall(promptly.choose, 'Choice:', choices)
    .then(function (choice) {
        var pick = picks[choice - 1];
        var resolution;

        // Store choice into resolutions
        if (pick.target === '*') {
            resolution = pick.pkgMeta._release || '*';
        } else {
            resolution = pick.target;
        }

        if (this._saveResolutions) {
            this._logger.info('resolution', 'Saved ' + name + '#' + resolution + ' as resolution', {
                name: name,
                resolution: resolution,
                action: this._resolutions[name] ? 'edit' : 'add'
            });
            this._resolutions[name] = resolution;
        }

        return pick;
    }.bind(this));
};

Manager.prototype._toData = function (decEndpoint) {
    return {
        endpoint: mout.object.pick(decEndpoint, ['name', 'source', 'target']),
        canonicalPkg: decEndpoint.canonicalPkg,
        pkgMeta: decEndpoint.pkgMeta
    };
};

Manager.prototype._getCap = function (comparators, side) {
    var matches;
    var candidate;
    var cap = {};
    var compare = side === 'lowest' ? semver.lt : semver.gt;

    comparators.forEach(function (comparator) {
        // Get version of this comparator
        // If it's an array, call recursively
        if (Array.isArray(comparator)) {
            candidate = this._getCap(comparator, side);

            // Compare with the current highest version
            if (!cap.version || compare(candidate.version, cap.version)) {
                cap = candidate;
            }
        // Otherwise extract the version from the comparator
        // using a simple regexp
        } else {
            matches = comparator.match(/(.*?)(\d+\.\d+\.\d+.*)$/);
            if (!matches) {
                return;
            }

            // Compare with the current highest version
            if (!cap.version || compare(matches[2], cap.version)) {
                cap.version = matches[2];
                cap.comparator = matches[1];
            }
        }
    }, this);

    return cap;
};

module.exports = Manager;
