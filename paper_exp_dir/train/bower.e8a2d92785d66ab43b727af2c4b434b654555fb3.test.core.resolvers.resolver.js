var expect = require('expect.js');
var fs = require('../../../lib/util/fs');
var path = require('path');
var util = require('util');
var rimraf = require('../../../lib/util/rimraf');
var mkdirp = require('mkdirp');
var tmp = require('tmp');
var Q = require('q');
var Logger = require('bower-logger');
var cmd = require('../../../lib/util/cmd');
var copy = require('../../../lib/util/copy');
var Resolver = require('../../../lib/core/resolvers/Resolver');
var defaultConfig = require('../../../lib/config');

describe('Resolver', function () {
var tempDir = path.resolve(__dirname, '../../tmp/tmp');
var testPackage = path.resolve(__dirname, '../../assets/package-a');
var logger;
var dirMode0777;
var config = defaultConfig();

before(function () {
var stat;

mkdirp.sync(tempDir);
stat = fs.statSync(tempDir);
dirMode0777 = stat.mode;
rimraf.sync(tempDir);

logger = new Logger();
});

afterEach(function () {
logger.removeAllListeners();
});

function create(decEndpoint) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
}

return new Resolver(decEndpoint, config, logger);
}

describe('.getSource', function () {
it('should return the resolver source', function () {
var resolver = create('foo');

expect(resolver.getSource()).to.equal('foo');
});
});

describe('.getName', function () {
it('should return the resolver name', function () {
var resolver = create({ source: 'foo', name: 'bar' });

expect(resolver.getName()).to.equal('bar');
});

it('should return the resolver source if none is specified (default guess mechanism)', function () {
var resolver = create('foo');

expect(resolver.getName()).to.equal('foo');
});
});

describe('.getTarget', function () {
it('should return the resolver target', function () {
var resolver = create({ source: 'foo', target: '~2.1.0' });

expect(resolver.getTarget()).to.equal('~2.1.0');
});

it('should return * if none was configured', function () {
var resolver = create('foo');

expect(resolver.getTarget()).to.equal('*');
});

it('should return * if latest was configured (for backwards compatibility)', function () {
var resolver = create('foo');

expect(resolver.getTarget()).to.equal('*');
});
});

describe('.hasNew', function () {
before(function () {
mkdirp.sync(tempDir);
});

beforeEach(function () {
fs.writeFileSync(path.join(tempDir, '.bower.json'), JSON.stringify({
name: 'test'
}));
});

after(function (next) {
rimraf(tempDir, next);
});

it('should throw an error if already working (resolving)', function (next) {
var resolver = create('foo');
var succeeded;

resolver._resolve = function () {};

resolver.resolve()
.then(function () {

resolver.resolve()
.then(function () {
next(succeeded ? new Error('Should have failed') : null);
});
})
.done();

resolver.hasNew({})
.then(function () {
succeeded = true;
}, function (err) {
expect(err).to.be.an(Error);
expect(err.code).to.equal('EWORKING');
expect(err.message).to.match(/already working/i);
});
});

it('should throw an error if already working (checking for newer version)', function (next) {
var resolver = create('foo');
var succeeded;

resolver.hasNew({})
.then(function () {

resolver.hasNew({})
.then(function () {
next(succeeded ? new Error('Should have failed') : null);
});
})
.done();

resolver.hasNew({})
.then(function () {
succeeded = true;
}, function (err) {
expect(err).to.be.an(Error);
expect(err.code).to.equal('EWORKING');
expect(err.message).to.match(/already working/i);
});
});

it('should resolve to true by default', function (next) {
var resolver = create('foo');

resolver.hasNew({})
.then(function (hasNew) {
expect(hasNew).to.equal(true);
next();
})
.done();
});

it('should call _hasNew with the package meta', function (next) {
var resolver = create('foo');
var meta;

resolver._hasNew = function (pkgMeta) {
meta = pkgMeta;
return Q.resolve(true);
};

resolver.hasNew({ name: 'test' })
.then(function () {
expect(meta).to.be.an('object');
expect(meta.name).to.equal('test');
next();
})
.done();
});

it('should not read the package meta if already passed', function (next) {
var resolver = create('foo');
var meta;

resolver._hasNew = function (pkgMeta) {
meta = pkgMeta;
return Q.resolve(true);
};

resolver.hasNew({
name: 'foo'
})
.then(function () {
expect(meta).to.be.an('object');
expect(meta.name).to.equal('foo');
next();
})
.done();
});
});

describe('.resolve', function () {
it('should reject the promise if _resolve is not implemented', function (next) {
var resolver = create('foo');

resolver.resolve()
.then(function () {
next(new Error('Should have rejected the promise'));
}, function (err) {
expect(err).to.be.an(Error);
expect(err.message).to.contain('_resolve not implemented');
next();
})
.done();
});

it('should throw an error if already working (resolving)', function (next) {
var resolver = create('foo');
var succeeded;

resolver._resolve = function () {};

resolver.resolve()
.then(function () {

resolver.resolve()
.then(function () {
next(succeeded ? new Error('Should have failed') : null);
});
})
.done();

resolver.resolve()
.then(function () {
succeeded = true;
}, function (err) {
expect(err).to.be.an(Error);
expect(err.code).to.equal('EWORKING');
expect(err.message).to.match(/already working/i);
});
});

it('should throw an error if already working (checking newer version)', function (next) {
var resolver = create('foo');
var succeeded;

resolver._resolve = function () {};

resolver.hasNew({})
.then(function () {

resolver.hasNew({})
.then(function () {
next(succeeded ? new Error('Should have failed') : null);
});
})
.done();

resolver.resolve()
.then(function () {
succeeded = true;
}, function (err) {
expect(err).to.be.an(Error);
expect(err.code).to.equal('EWORKING');
expect(err.message).to.match(/already working/i);
});
});

it('should call all the functions necessary to resolve by the correct order', function (next) {
var resolver;

function DummyResolver() {
Resolver.apply(this, arguments);
this._stack = [];
}

util.inherits(DummyResolver, Resolver);

DummyResolver.prototype.getStack = function () {
return this._stack;
};

DummyResolver.prototype.resolve = function () {
this._stack = [];
return Resolver.prototype.resolve.apply(this, arguments);
};

DummyResolver.prototype._createTempDir = function () {
this._stack.push('before _createTempDir');
return Resolver.prototype._createTempDir.apply(this, arguments)
.then(function (val) {
this._stack.push('after _createTempDir');
return val;
}.bind(this));
};
DummyResolver.prototype._resolve = function () {};
DummyResolver.prototype._readJson = function () {
this._stack.push('before _readJson');
return Resolver.prototype._readJson.apply(this, arguments)
.then(function (val) {
this._stack.push('after _readJson');
return val;
}.bind(this));
};
DummyResolver.prototype._applyPkgMeta = function () {
this._stack.push('before _applyPkgMeta');
return Resolver.prototype._applyPkgMeta.apply(this, arguments)
.then(function (val) {
this._stack.push('after _applyPkgMeta');
return val;
}.bind(this));
};
DummyResolver.prototype._savePkgMeta = function () {
this._stack.push('before _savePkgMeta');
return Resolver.prototype._savePkgMeta.apply(this, arguments)
.then(function (val) {
this._stack.push('after _savePkgMeta');
return val;
}.bind(this));
};

resolver = new DummyResolver({ source: 'foo'}, config, logger);

resolver.resolve()
.then(function () {
expect(resolver.getStack()).to.eql([
'before _createTempDir',
'after _createTempDir',
'before _readJson',
'after _readJson',

'before _applyPkgMeta',
'after _applyPkgMeta',
'before _savePkgMeta',
'after _savePkgMeta'
]);
next();
})
.done();
});

it('should resolve with the canonical dir (folder)', function (next) {
var resolver = create('foo');

resolver._resolve = function () {};

resolver.resolve()
.then(function (folder) {
expect(folder).to.be.a('string');
expect(fs.existsSync(folder)).to.be(true);
next();
})
.done();
});
});

describe('.getTempDir', function () {
it('should return null if resolver is not yet resolved', function () {
var resolver = create('foo');

expect(resolver.getTempDir() == null).to.be(true);
});

it('should still return null if resolve failed', function () {
it('should still return null', function (next) {
var resolver = create('foo');

resolver._resolve = function () {
throw new Error('I\'ve failed to resolve');
};

resolver.resolve()
.fail(function () {
expect(resolver.getTempDir() == null).to.be(true);
next();
});
});
});

it('should return the canonical dir (folder) if resolve succeeded', function (next) {
var resolver = create('foo');

resolver._resolve = function () {};

resolver.resolve()
.then(function () {
var dir = resolver.getTempDir();

expect(dir).to.be.a('string');
expect(fs.existsSync(dir)).to.be(true);
next();
})
.done();
});
});

describe('.getPkgMeta', function () {
it('should return null if resolver is not yet resolved', function () {
var resolver = create('foo');

expect(resolver.getPkgMeta() == null).to.be(true);
});

it('should still return null if resolve failed', function () {
it('should still return null', function (next) {
var resolver = create('foo');

resolver._resolve = function () {
throw new Error('I\'ve failed to resolve');
};

resolver.resolve()
.fail(function () {
expect(resolver.getPkgMeta() == null).to.be(true);
next();
});
});
});

it('should return the package meta if resolve succeeded', function (next) {
var resolver = create('foo');

resolver._resolve = function () {};

resolver.resolve()
.then(function () {
expect(resolver.getPkgMeta()).to.be.an('object');
next();
})
.done();
});
});

describe('._createTempDir', function () {
it('should create a directory inside a "username/bower" folder, located within the OS temp folder', function (next) {
var resolver = create('foo');

resolver._createTempDir()
.then(function (dir) {
var dirname;
var osTempDir;

expect(dir).to.be.a('string');
expect(fs.existsSync(dir)).to.be(true);

dirname = path.dirname(dir);
osTempDir = path.resolve(tmp.tmpdir);

expect(dir.indexOf(osTempDir)).to.be(0);
expect(dir.indexOf(config.tmp)).to.be(0);

expect(path.basename(dirname)).to.equal('bower');
expect(path.dirname(path.dirname(dirname))).to.equal(osTempDir);
next();
})
.done();
});

it('should set the dir mode the same as the process', function (next) {
var resolver = create('foo');

resolver._createTempDir()
.then(function (dir) {
var stat = fs.statSync(dir);
var expectedMode = dirMode0777 & ~process.umask();

expect(stat.mode).to.equal(expectedMode);
next();
})
.done();
});

it('should remove the folder after execution', function (next) {
this.timeout(15000);

rimraf(config.tmp, function (err) {
if (err) return next(err);

cmd('node', ['test/assets/test-temp-dir/test.js'], { cwd: path.resolve(__dirname, '../../..') })
.then(function () {
expect(fs.existsSync(config.tmp)).to.be(true);
expect(fs.readdirSync(config.tmp)).to.eql([]);
next();
}, function (err) {
next(new Error(err.details));
})
.done();
});
});

it('should remove the folder on an uncaught exception', function (next) {
rimraf(config.tmp, function (err) {
if (err) return next(err);

cmd('node', ['test/assets/test-temp-dir/test-exception.js'], { cwd: path.resolve(__dirname, '../../..') })
.then(function () {
next(new Error('The command should have failed'));
}, function () {
expect(fs.existsSync(config.tmp)).to.be(true);
expect(fs.readdirSync(config.tmp)).to.eql([]);
next();
})
.done();
});
});

it('should set _tempDir with the created directory', function (next) {
var resolver = create('foo');

resolver._createTempDir()
.then(function (dir) {
expect(resolver._tempDir).to.be.ok();
expect(resolver._tempDir).to.equal(dir);
next();
})
.done();
});

it('should remove @ from directory names', function (next) {
var resolver = create('foo@bar');

resolver._createTempDir()
.then(function (dir) {
expect(resolver._tempDir).to.be.ok();
expect(resolver._tempDir.indexOf('@')).to.equal(-1);
next();
})
