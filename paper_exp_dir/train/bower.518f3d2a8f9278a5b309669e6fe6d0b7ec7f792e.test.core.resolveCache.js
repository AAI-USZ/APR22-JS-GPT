var path = require('path');
var mout = require('mout');
var rimraf = require('rimraf');
var fs = require('graceful-fs');
var Q = require('q');
var expect = require('expect.js');
var mkdirp = require('mkdirp');
var ResolveCache = require('../../lib/core/ResolveCache');
var defaultConfig = require('../../lib/config');
var cmd = require('../../lib/util/cmd');
var copy = require('../../lib/util/copy');
var md5 = require('../../lib/util/md5');

describe('ResolveCache', function () {
var resolveCache;
var testPackage = path.resolve(__dirname, '../assets/package-a');
var tempPackage = path.resolve(__dirname, '../assets/temp');
var tempPackage2 = path.resolve(__dirname, '../assets/temp2');
var cacheDir = path.join(__dirname, '../assets/temp-resolve-cache');

before(function (next) {

rimraf.sync(cacheDir);


resolveCache = new ResolveCache(mout.object.deepMixIn(defaultConfig, {
storage: {
packages: cacheDir
}
}));


cmd('git', ['checkout', '0.2.0'], { cwd: testPackage })
.then(next.bind(next, null), next);
});

beforeEach(function () {

resolveCache.reset();
});

after(function () {

rimraf.sync(cacheDir);
});

describe('.constructor', function () {
beforeEach(function () {

rimraf.sync(tempPackage);
});
after(function () {

rimraf.sync(tempPackage);
});

function initialize(cacheDir) {
return new ResolveCache(mout.object.deepMixIn(defaultConfig, {
storage: {
packages: cacheDir
}
}));
}

it('should create the cache folder if it doesn\'t exists', function () {
initialize(tempPackage);
expect(fs.existsSync(tempPackage)).to.be(true);
});

it('should not error out if the cache folder already exists', function () {
mkdirp.sync(tempPackage);
initialize(tempPackage);
});
});

describe('.store', function () {
var oldFsRename = fs.rename;

beforeEach(function (next) {

fs.rename = oldFsRename;


rimraf.sync(tempPackage);
copy.copyDir(testPackage, tempPackage, { ignore: ['.git'] })
.then(next.bind(next, null), next);
});

it('should move the canonical dir to source-md5/version/ folder if package meta has a version', function (next) {
resolveCache.store(tempPackage, {
name: 'foo',
version: '1.0.0',
_source: 'foo',
_target: '*'
})
.then(function (dir) {
expect(dir).to.equal(path.join(cacheDir, md5('foo'), '1.0.0'));
expect(fs.existsSync(dir)).to.be(true);
expect(fs.existsSync(path.join(dir, 'baz'))).to.be(true);
expect(fs.existsSync(tempPackage)).to.be(false);

next();
})
.done();
});

it('should move the canonical dir to source-md5/target/ folder if package meta has no version', function (next) {
resolveCache.store(tempPackage, {
name: 'foo',
_source: 'foo',
_target: 'some-branch'
})
.then(function (dir) {
expect(dir).to.equal(path.join(cacheDir, md5('foo'), 'some-branch'));
expect(fs.existsSync(dir)).to.be(true);
expect(fs.existsSync(path.join(dir, 'baz'))).to.be(true);
expect(fs.existsSync(tempPackage)).to.be(false);

next();
})
.done();
});

it('should move the canonical dir to source-md5/_wildcard/ folder if package meta has no version and target is *', function (next) {
resolveCache.store(tempPackage, {
name: 'foo',
_source: 'foo',
_target: '*'
})
.then(function (dir) {
expect(dir).to.equal(path.join(cacheDir, md5('foo'), '_wildcard'));
expect(fs.existsSync(dir)).to.be(true);
expect(fs.existsSync(path.join(dir, 'baz'))).to.be(true);
expect(fs.existsSync(tempPackage)).to.be(false);

next();
})
.done();
});

it('should overwrite if the exact same package source/version exists', function (next) {
var cachePkgDir = path.join(cacheDir, md5('foo'), '1.0.0-rc.blehhh');

mkdirp.sync(cachePkgDir);
fs.writeFileSync(path.join(cachePkgDir, '_bleh'), 'w00t');

resolveCache.store(tempPackage, {
name: 'foo',
version: '1.0.0-rc.blehhh',
_source: 'foo',
_target: '*'
})
.then(function (dir) {
expect(dir).to.equal(cachePkgDir);
expect(fs.existsSync(dir)).to.be(true);
expect(fs.existsSync(path.join(dir, 'baz'))).to.be(true);
expect(fs.existsSync(tempPackage)).to.be(false);
expect(fs.existsSync(path.join(cachePkgDir, '_bleh'))).to.be(false);

next();
})
.done();
});

it('should read the package meta if not present', function (next) {
var pkgMeta = path.join(tempPackage, '.bower.json');


copy.copyFile(path.join(tempPackage, 'component.json'), pkgMeta)
.then(function () {
return Q.nfcall(fs.readFile, pkgMeta)
.then(function (contents) {
var json = JSON.parse(contents.toString());

json._target = '~0.2.0';
json._source = 'git://github.com/bower/test-package.git';

return Q.nfcall(fs.writeFile, pkgMeta, JSON.stringify(json, null, '  '));
});
})

.then(function () {
return resolveCache.store(tempPackage);
})
.then(function (dir) {
expect(dir).to.equal(path.join(cacheDir, md5('git://github.com/bower/test-package.git'), '0.2.0'));
expect(fs.existsSync(dir)).to.be(true);
expect(fs.existsSync(path.join(dir, 'baz'))).to.be(true);
expect(fs.existsSync(tempPackage)).to.be(false);

next();
})
.done();
});

it('should error out when reading the package meta if the file does not exist', function (next) {
resolveCache.store(tempPackage)
.then(function () {
next(new Error('Should have failed'));
}, function (err) {
expect(err).to.be.an(Error);
expect(err.code).to.equal('ENOENT');
expect(err.message).to.contain(path.join(tempPackage, '.bower.json'));

next();
})
.done();
});

it('should error out when reading an invalid package meta', function (next) {
var pkgMeta = path.join(tempPackage, '.bower.json');

return Q.nfcall(fs.writeFile, pkgMeta, 'w00t')
.then(function () {
return resolveCache.store(tempPackage)
.then(function () {
next(new Error('Should have failed'));
}, function (err) {
expect(err).to.be.an(Error);
expect(err.code).to.equal('EMALFORMED');
expect(err.message).to.contain(path.join(tempPackage, '.bower.json'));

next();
});
})
.done();
});

it('should move the canonical dir, even if it is in a different drive', function (next) {
var hittedMock = false;

fs.rename = function (src, dest, cb) {
hittedMock = true;

setTimeout(function () {
var err = new Error();
err.code = 'EXDEV';
cb(err);
}, 10);
};

resolveCache.store(tempPackage, {
name: 'foo',
_source: 'foo',
_target: 'some-branch'
})
.then(function (dir) {

expect(hittedMock).to.be(true);

expect(dir).to.equal(path.join(cacheDir, md5('foo'), 'some-branch'));
expect(fs.existsSync(dir)).to.be(true);
expect(fs.existsSync(path.join(dir, 'baz'))).to.be(true);
expect(fs.existsSync(tempPackage)).to.be(false);

next();
})
.done();
});

it('should update the in-memory cache', function (next) {

resolveCache.versions('test-in-memory')

.then(function () {
return copy.copyDir(tempPackage, tempPackage2, { ignore: ['.git'] });
})

.then(function () {
return resolveCache.store(tempPackage, {
name: 'foo',
version: '1.0.0',
_source: 'test-in-memory',
_target: '*'
});
})
.then(function () {
return resolveCache.store(tempPackage2, {
name: 'foo',
version: '1.0.1',
_source: 'test-in-memory',
_target: '*'
});
})

.then(function () {
return resolveCache.versions('test-in-memory')
.then(function (versions) {
expect(versions).to.eql(['1.0.1', '1.0.0']);

next();
});
})
.done();
});
});

describe('.versions', function () {
it('should resolve to an array', function (next) {
resolveCache.versions(String(Math.random()))
.then(function (versions) {
expect(versions).to.be.an('array');
next();
})
.done();
});

it('should ignore non-semver folders of the source', function (next) {
var source = String(Math.random());
var sourceId = md5(source);
var sourceDir = path.join(cacheDir, sourceId);


fs.mkdirSync(sourceDir);
fs.mkdirSync(path.join(sourceDir, '0.0.1'));
fs.mkdirSync(path.join(sourceDir, '0.1.0'));
fs.mkdirSync(path.join(sourceDir, 'foo'));

resolveCache.versions(source)
.then(function (versions) {
expect(versions).to.not.contain('foo');
expect(versions).to.contain('0.0.1');
expect(versions).to.contain('0.1.0');
next();
})
.done();
});

it('should order the versions', function (next) {
var source = String(Math.random());
var sourceId = md5(source);
var sourceDir = path.join(cacheDir, sourceId);


fs.mkdirSync(sourceDir);
fs.mkdirSync(path.join(sourceDir, '0.0.1'));
fs.mkdirSync(path.join(sourceDir, '0.1.0'));
fs.mkdirSync(path.join(sourceDir, '0.1.0-rc.1'));

resolveCache.versions(source)
.then(function (versions) {
expect(versions).to.eql(['0.1.0', '0.1.0-rc.1', '0.0.1']);
next();
})
.done();
});

it('should cache versions to speed-up subsequent calls', function (next) {
var source = String(Math.random());
var sourceId = md5(source);
var sourceDir = path.join(cacheDir, sourceId);


fs.mkdirSync(sourceDir);
fs.mkdirSync(path.join(sourceDir, '0.0.1'));

resolveCache.versions(source)
.then(function () {

rimraf.sync(sourceDir);

return resolveCache.versions(source);
})
.then(function (versions) {
expect(versions).to.eql(['0.0.1']);
next();
})
.done();
});
});

describe('.retrieve', function () {
it('should resolve to empty if there are no packages for the requested source', function (next) {
resolveCache.retrieve(String(Math.random()))
.spread(function () {
expect(arguments.length).to.equal(0);
next();
})
.done();
});

it('should resolve to empty if there are no suitable packages for the requested target', function (next) {
var source = String(Math.random());
var sourceId = md5(source);
var sourceDir = path.join(cacheDir, sourceId);


fs.mkdirSync(sourceDir);
fs.mkdirSync(path.join(sourceDir, '0.0.1'));
fs.mkdirSync(path.join(sourceDir, '0.1.0'));
fs.mkdirSync(path.join(sourceDir, '0.1.9'));
fs.mkdirSync(path.join(sourceDir, '0.2.0'));

resolveCache.retrieve(source, '~0.3.0')
.spread(function () {
expect(arguments.length).to.equal(0);

return resolveCache.retrieve(source, 'some-branch');
})
.spread(function () {
expect(arguments.length).to.equal(0);

next();
})
.done();
});

it('should remove invalid packages from the cache if their package meta is missing or invalid', function (next) {
var source = String(Math.random());
var sourceId = md5(source);
var sourceDir = path.join(cacheDir, sourceId);


fs.mkdirSync(sourceDir);
fs.mkdirSync(path.join(sourceDir, '0.0.1'));
fs.mkdirSync(path.join(sourceDir, '0.1.0'));
fs.mkdirSync(path.join(sourceDir, '0.1.9'));
fs.mkdirSync(path.join(sourceDir, '0.2.0'));


fs.writeFileSync(path.join(sourceDir, '0.2.0', '.bower.json'), 'w00t');

resolveCache.retrieve(source, '~0.1.0')
.spread(function () {
var dirs = fs.readdirSync(sourceDir);

expect(arguments.length).to.equal(0);
expect(dirs).to.contain('0.0.1');
expect(dirs).to.contain('0.2.0');
next();
})
.done();
});

it('should resolve to the highest package that matches a range target, ignoring pre-releases', function (next) {
var source = String(Math.random());
var sourceId = md5(source);
var sourceDir = path.join(cacheDir, sourceId);
var json = { name: 'foo' };


fs.mkdirSync(sourceDir);

json.version = '0.0.1';
fs.mkdirSync(path.join(sourceDir, '0.0.1'));
fs.writeFileSync(path.join(sourceDir, '0.0.1', '.bower.json'), JSON.stringify(json, null, '  '));

json.version = '0.1.0';
fs.mkdirSync(path.join(sourceDir, '0.1.0'));
fs.writeFileSync(path.join(sourceDir, '0.1.0', '.bower.json'), JSON.stringify(json, null, '  '));

json.version = '0.1.0-rc.1';
fs.mkdirSync(path.join(sourceDir, '0.1.0-rc.1'));
fs.writeFileSync(path.join(sourceDir, '0.1.0-rc.1', '.bower.json'), JSON.stringify(json, null, '  '));

json.version = '0.1.9';
fs.mkdirSync(path.join(sourceDir, '0.1.9'));
fs.writeFileSync(path.join(sourceDir, '0.1.9', '.bower.json'), JSON.stringify(json, null, '  '));

json.version = '0.2.0';
fs.mkdirSync(path.join(sourceDir, '0.2.0'));
fs.writeFileSync(path.join(sourceDir, '0.2.0', '.bower.json'), JSON.stringify(json, null, '  '));
