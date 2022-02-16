var expect = require('expect.js');
var path = require('path');
var fs = require('../../../lib/util/fs');
var path = require('path');
var rimraf = require('../../../lib/util/rimraf');
var mkdirp = require('mkdirp');
var Q = require('q');
var Logger = require('bower-logger');
var cmd = require('../../../lib/util/cmd');
var copy = require('../../../lib/util/copy');
var FsResolver = require('../../../lib/core/resolvers/FsResolver');
var defaultConfig = require('../../../lib/config');

describe('FsResolver', function() {
var tempSource;
var logger;
var testPackage = path.resolve(__dirname, '../../assets/package-a');

before(function(next) {
logger = new Logger();


cmd('git', ['checkout', '0.2.1'], { cwd: testPackage }).then(
next.bind(next, null),
next
);
});

afterEach(function(next) {
logger.removeAllListeners();

if (tempSource) {
rimraf(tempSource, next);
tempSource = null;
} else {
next();
}
});

function create(decEndpoint) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
}

return new FsResolver(decEndpoint, defaultConfig(), logger);
}

describe('.constructor', function() {
it('should guess the name from the path', function() {
var resolver = create(path.resolve('../../assets/package-zip.zip'));

expect(resolver.getName()).to.equal('package-zip');
});

it('should make paths absolute and normalized', function() {
var resolver;

resolver = create(path.relative(process.cwd(), testPackage));
expect(resolver.getSource()).to.equal(testPackage);

resolver = create(testPackage + '/something/..');
expect(resolver.getSource()).to.equal(testPackage);
});

it.skip('should use config.cwd for resolving relative paths');

it('should error out if a target was specified', function(next) {
var resolver;

try {
resolver = create({ source: testPackage, target: '0.0.1' });
} catch (err) {
expect(err).to.be.an(Error);
expect(err.message).to.match(/can\'t resolve targets/i);
expect(err.code).to.equal('ENORESTARGET');
return next();
}

next(new Error('Should have thrown'));
});
});

describe('.hasNew', function() {
it('should resolve always to true (for now..)', function(next) {
var resolver = create(testPackage);

var pkgMeta = {
name: 'test'
};

resolver
.hasNew(pkgMeta)
.then(function(hasNew) {
expect(hasNew).to.be(true);
next();
})
.done();
});

//it.skip('should be false if the file mtime hasn\'t changed');




});

describe('.resolve', function() {



function assertMain(dir, singleFile) {
return Q.nfcall(fs.readFile, path.join(dir, '.bower.json')).then(
function(contents) {
var pkgMeta = JSON.parse(contents.toString());

expect(pkgMeta.main).to.equal(singleFile);

return pkgMeta;
}
);
}

it('should copy the source directory contents', function(next) {
var resolver = create(testPackage);

resolver
.resolve()
.then(function(dir) {
expect(fs.existsSync(path.join(dir, 'foo'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'bar'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'baz'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'README.md'))).to.be(
true
);
expect(fs.existsSync(path.join(dir, 'more'))).to.be(true);
expect(
fs.existsSync(path.join(dir, 'more', 'more-foo'))
).to.be(true);
next();
})
.done();
});

it('should copy the source file, renaming it to index', function(next) {
var resolver = create(path.join(testPackage, 'foo'));

resolver
.resolve()
.then(function(dir) {
expect(fs.existsSync(path.join(dir, 'index'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'foo'))).to.be(false);
expect(fs.existsSync(path.join(dir, 'bar'))).to.be(false);
})
.then(function() {

var resolver = create(path.join(testPackage, 'README.md'));
return resolver.resolve();
})
.then(function(dir) {
expect(fs.existsSync(path.join(dir, 'index.md'))).to.be(
true
);
expect(fs.existsSync(path.join(dir, 'README.md'))).to.be(
false
);

return assertMain(dir, 'index.md').then(
next.bind(next, null)
);
})
.done();
});

it('should rename to index if source is a folder with just one file in it', function(next) {
var resolver;

tempSource = path.resolve(__dirname, '../../tmp/tmp');

mkdirp.sync(tempSource);
resolver = create(tempSource);

copy.copyFile(
path.join(testPackage, 'foo'),
path.join(tempSource, 'foo')
)
.then(resolver.resolve.bind(resolver))
.then(function(dir) {
expect(fs.existsSync(path.join(dir, 'index'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'foo'))).to.be(false);

return assertMain(dir, 'index').then(next.bind(next, null));
