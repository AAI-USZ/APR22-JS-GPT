
















var events     = require('events');
var semver     = require('semver');
var async      = require('async');
var path       = require('path');
var glob       = require('glob');
var fs         = require('fs');
var _          = require('lodash');

var Package    = require('./package');
var UnitWork   = require('./unit_work');
var config     = require('./config');
var fallback   = require('../util/fallback');
var template   = require('../util/template');
var prune      = require('../util/prune');






var Manager = function (endpoints, opts) {
this.dependencies    = {};
this.cwd             = process.cwd();
this.endpoints       = endpoints || [];
this.unitWork        = new UnitWork;
this.opts            = opts || {};
this.errors          = [];
};

Manager.prototype = Object.create(events.EventEmitter.prototype);
Manager.prototype.constructor = Manager;

Manager.prototype.loadJSON = function () {
fallback(this.cwd, [config.json, 'component.json'], function (file) {
if (file !== null) {
if (file !== config.json) {
this.emit('warn', 'Using deprecated "component.json". Please use "bower.json" instead');
}

return this.readJSON(path.join(this.cwd, file));
}

this.createJSON();
return this.emit('loadJSON');
}.bind(this));

return this;
};

Manager.prototype.resolve = function () {
var resolved = function () {

if (this.errors.length) return this.reportErrors();

if (!this.prune()) return this.emit('resolve', false);

this.once('install', this.emit.bind(this, 'resolve', true)).install();
}.bind(this);


this.once('resolveLocal', function () {
if (this.endpoints.length) {





this.once('resolveEndpoints', resolved).resolveEndpoints();
} else {
this.once('resolveFromJson', resolved).resolveFromJson();
}
}).resolveLocal();

return this;
};

Manager.prototype.resolveLocal = function () {
glob('./' + config.directory + '/*', function (err, dirs) {
if (err) return this.emit('error', err);
dirs.forEach(function (dir) {
var name = path.basename(dir);
var pkg = new Package(name, dir, this);

this.dependencies[name] = [];
this.dependencies[name].push(pkg);

this.gatherPackageErrors(pkg);
}.bind(this));
this.emit('resolveLocal');
}.bind(this));

return this;
};

Manager.prototype.resolveEndpoints = function () {
var endpointNames = this.opts.endpointNames || {};

async.forEach(this.endpoints, function (endpoint, next) {
var name = endpointNames[endpoint];
var pkg  = new Package(name, endpoint, this);
var errorNext;

pkg.root = true;
this.dependencies[name] = this.dependencies[name] || [];
this.dependencies[name].push(pkg);

this.gatherPackageErrors(pkg);
pkg.once('error', errorNext = next.bind(next, null));
pkg.once('resolve', function () {
pkg.removeListener('error', errorNext);
next();
}).resolve();
}.bind(this), this.emit.bind(this, 'resolveEndpoints'));

return this;
};

Manager.prototype.resolveFromJson = function () {
this.once('loadJSON', function () {
var dependencies = this.json.dependencies || {};


if (!this.opts.production && this.json.devDependencies) {
dependencies = _.extend({}, dependencies, this.json.devDependencies);
}

async.forEach(Object.keys(dependencies), function (name, next) {
var endpoint = dependencies[name];
var pkg      = new Package(name, endpoint, this);
var errorNext;

pkg.root = true;

this.gatherPackageErrors(pkg);

pkg.once('error', errorNext = next.bind(next, null));
pkg.once('resolve', function () {
pkg.removeListener('error', errorNext);

this.dependencies[pkg.name] = this.dependencies[pkg.name] || [];
this.dependencies[pkg.name].push(pkg);

next();
}.bind(this)).resolve();
}.bind(this), this.emit.bind(this, 'resolveFromJson'));
}.bind(this)).loadJSON();

return this;
};


Manager.prototype.createJSON = function () {

this.json = {
name: path.basename(this.cwd),
version: '0.0.0'
},
this.name = this.json.name;
this.version = this.json.version;
};

Manager.prototype.readJSON = function (filename) {
fs.readFile(filename, 'utf8', function (err, json) {
if (err) return this.emit('error', err);
try {
this.json = JSON.parse(json);
} catch (e) {
return this.emit('error', new Error('There was an error while reading the ' + config.json + ': ' + e.message));
}
this.name    = this.json.name;
this.version = this.json.version;
this.emit('loadJSON', json.slice(-1) === '\n');
}.bind(this));
};

Manager.prototype.getDeepDependencies = function () {
var result = {};

for (var name in this.dependencies) {
this.dependencies[name].forEach(function (pkg) {
result[pkg.name] = result[pkg.name] || [];
result[pkg.name].push(pkg);
pkg.getDeepDependencies().forEach(function (pkg) {
result[pkg.name] = result[pkg.name] || [];
result[pkg.name].push(pkg);
});
});
}

return result;
};

Manager.prototype.prune = function () {
var result = prune(this.getDeepDependencies(), this.opts.forceLatest);
var name;


if (result.conflicted) {
for (name in result.conflicted) {
this.reportConflicts(name, result.conflicted[name]);
}

return false;
}

this.dependencies = {};



if (result.forceblyResolved) {
for (name in result.forceblyResolved) {
this.reportForceblyResolved(name, result.forceblyResolved[name]);
this.dependencies[name] = result.forceblyResolved[name];
this.dependencies[name][0].root = true;
}
}

_.extend(this.dependencies, result.resolved);

return true;
};

Manager.prototype.gatherPackageErrors = function (pkg) {
pkg.on('error', function (err, origin) {
pkg = origin || pkg;


if (!err.message.indexOf(pkg.name + ' ')) {
err.message = err.message.substr(pkg.name.length + 1);
}

this.errors.push({ pkg: pkg, error: err });
}.bind(this));
};

Manager.prototype.install = function () {
async.forEach(Object.keys(this.dependencies), function (name, next) {
var pkg = this.dependencies[name][0];
pkg.once('install', function () {
this.emit('package', pkg);
next();
}.bind(this)).install();
pkg.once('error', next);
}.bind(this), function () {
if (this.errors.length) this.reportErrors();
return this.emit('install');
}.bind(this));
};

Manager.prototype.muteDependencies = function () {
for (var name in this.dependencies) {
this.dependencies[name].forEach(function (pkg) {
pkg.removeAllListeners();
pkg.on('error', function () {});
});
}
};

Manager.prototype.reportErrors = function () {
this.muteDependencies();
template('error-summary', { errors: this.errors }).on('data', function (data) {
this.emit('data', data);
this.emit('resolve', false);
}.bind(this));
};

Manager.prototype.reportConflicts = function (name, packages) {
var versions = [];
var requirements = [];

packages = packages.filter(function (pkg) { return !!pkg.version; });
packages.forEach(function (pkg) {
requirements.push({ pkg: pkg, tag: pkg.originalTag || '~' + pkg.version });
versions.push((pkg.originalTag || '~' + pkg.version).white);
});

this.emit('error', new Error('No resolvable version for ' + name));
this.emit('data', template('conflict', {
name: name,
requirements: requirements,
json: config.json,
versions: versions.slice(0, -1).join(', ') + ' or ' + versions[versions.length - 1]
}, true));
};

Manager.prototype.reportForceblyResolved = function (name, packages) {
var requirements = [];

packages = packages.filter(function (pkg) { return !!pkg.version; });
packages.forEach(function (pkg) {
requirements.push({ pkg: pkg, tag: pkg.originalTag || '~' + pkg.version });
});

this.emit('data', template('resolved-conflict', {
name: name,
requirements: requirements,
json: config.json,
resolvedTo: packages[0].version,
forceLatest: this.opts.forceLatest
}, true));
};






Manager.prototype.list = function (options) {
options = options || {};

this._isCheckingVersions = !options.offline && !options.paths && !options.map && options.argv;
this.once('resolveLocal', this.getDependencyList.bind(this))
.resolveLocal();
};

Manager.prototype.getDependencyList = function () {

var packages = {};
var values;
var checkVersions = this._isCheckingVersions;

