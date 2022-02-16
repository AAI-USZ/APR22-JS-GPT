// So CLI output is monochrome in tests
process.env.TERM = 'dumb';

// We need to reload supports-color and chalk that caches its result
Object.keys(require.cache).map(function(e) {
    if (e.match('supports-color') || e.match('chalk')) {
        delete require.cache[e];
    }
});

var Q = require('q');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var uuid = require('node-uuid');
var object = require('mout/object');
var fs = require('fs');
var glob = require('glob');
var os = require('os');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var cmd = require('../lib/util/cmd');
var config = require('../lib/config');

// For better promise errors
Q.longStackSupport = true;

// Those are needed for Travis or not configured git environment
var env = {
    'GIT_AUTHOR_DATE': 'Sun Apr 7 22:13:13 2013 +0000',
    'GIT_AUTHOR_NAME': 'André Cruz',
    'GIT_AUTHOR_EMAIL': 'amdfcruz@gmail.com',
    'GIT_COMMITTER_DATE': 'Sun Apr 7 22:13:13 2013 +0000',
    'GIT_COMMITTER_NAME': 'André Cruz',
    'GIT_COMMITTER_EMAIL': 'amdfcruz@gmail.com',
};

// Preserve the original environment
object.mixIn(env, process.env);

var tmpLocation = path.join(
    os.tmpdir ? os.tmpdir() : os.tmpDir(),
    'bower-tests',
    uuid.v4().slice(0, 8)
);

exports.require = function (name, stubs) {
    if (stubs) {
        return proxyquire(path.join(__dirname, '../', name), stubs);
    } else {
        return require(path.join(__dirname, '../', name));
    }
};

// We need to reset cache because tests are reusing temp directories
beforeEach(function () {
    config.reset();
});

after(function () {
    rimraf.sync(tmpLocation);
});

exports.TempDir = (function() {
    function TempDir (defaults) {
        this.path = path.join(tmpLocation, uuid.v4());
        this.defaults = defaults;
    }

    TempDir.prototype.create = function (files, defaults) {
        var that = this;

        defaults = defaults || this.defaults || {};
        files = object.merge(files || {}, defaults);

        this.meta = function(tag) {
            if (tag) {
                return files[tag]['bower.json'];
            } else {
                return files['bower.json'];
            }
        };

        if (files) {
            object.forOwn(files, function (contents, filepath) {
                if (typeof contents === 'object') {
                    contents = JSON.stringify(contents, null, ' ') + '\n';
                }

                var fullPath = path.join(that.path, filepath);
                mkdirp.sync(path.dirname(fullPath));
                fs.writeFileSync(fullPath, contents);
            });
        }

        return this;
    };

    TempDir.prototype.prepare = function (files) {
        rimraf.sync(this.path);
        mkdirp.sync(this.path);
        this.create(files);

        return this;
    };

    // TODO: Rewrite to synchronous form
    TempDir.prototype.prepareGit = function (revisions) {
        var that = this;

        revisions = object.merge(revisions || {}, this.defaults);

        rimraf.sync(that.path);

        mkdirp.sync(that.path);

        var promise = new Q();

        object.forOwn(revisions, function (files, tag) {
            promise = promise.then(function () {
                return that.git('init');
            }).then(function () {
                that.glob('./!(.git)').map(function (removePath) {
                    var fullPath = path.join(that.path, removePath);

                    rimraf.sync(fullPath);
                });

                that.create(files, {});
            }).then(function () {
                return that.git('add', '-A');
            }).then(function () {
                return that.git('commit', '-m"commit"');
            }).then(function () {
                return that.git('tag', tag);
            });
        });

        return promise;
    };

    TempDir.prototype.glob = function (pattern) {
        return glob.sync(pattern, {
            cwd: this.path,
            dot: true
        });
    };

    TempDir.prototype.read = function (name) {
        return fs.readFileSync(path.join(this.path, name), 'utf8');
    };

    TempDir.prototype.readJson = function (name) {
        return JSON.parse(this.read(name));
    };

    TempDir.prototype.git = function () {
        var args = Array.prototype.slice.call(arguments);

        return cmd('git', args, { cwd: this.path, env: env });
    };

    TempDir.prototype.exists = function (name) {
        return fs.existsSync(path.join(this.path, name));
    };

    return TempDir;
})();

exports.expectEvent = function expectEvent(emitter, eventName) {
    var deferred = Q.defer();

    emitter.once(eventName, function () {
        deferred.resolve(arguments);
    });

    emitter.once('error', function (reason) {
        deferred.reject(reason);
    });

    return deferred.promise;
};

exports.command = function (command, stubs) {
    var commandStubs = {};

    commandStubs['./' + command] = exports.require(
        'lib/commands/' + command, stubs
    );

    var instance = exports.require(
        'lib/commands/index', commandStubs
    )[command];

    if (!instance) {
        throw new Error('Unknown command: ' + command);
    }

    return instance;
};

exports.run = function (command, args) {
    var logger = command.apply(command, args || []);

    // Hack so we can intercept prompring for data
    logger.prompt = function(data) {
        logger.emit('confirm', data);
    };

    var promise = exports.expectEvent(logger, 'end');

    promise.logger = logger;

    return promise;
};

exports.ensureDone = function(done, callback) {
    callback = callback || function() {};

    return function() {
        try {
            callback.apply(null, arguments);
            done();
        } catch(e) {
            done(e);
        }
    };
};

exports.capture = function(callback) {
    var oldStdout = process.stdout.write;
    var oldStderr = process.stderr.write;

    var stdout = '';
    var stderr = '';

    process.stdout.write = function(text) {
        stdout += text;
    };

    process.stderr.write = function(text) {
        stderr += text;
    };

    return Q.fcall(callback).then(function() {
        process.stdout.write = oldStdout;
        process.stderr.write = oldStderr;

        return [stdout, stderr];
    }).fail(function(e) {
        process.stdout.write = oldStdout;
        process.stderr.write = oldStderr;

        throw e;
    });
};
