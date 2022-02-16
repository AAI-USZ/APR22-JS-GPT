var expect = require('expect.js');
var path = require('path');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var cmd = require('../../../lib/util/cmd');
var copy = require('../../../lib/util/copy');
var FsResolver = require('../../../lib/resolve/resolvers/FsResolver');

describe('FsResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package'),
tempSource;

before(function (next) {


cmd('git', ['checkout', '0.2.1'], { cwd: testPackage })
.then(next.bind(next, null), next);
});

afterEach(function (next) {
if (tempSource) {
rimraf(tempSource, next);
tempSource = null;
} else {
next();
}
});

describe('.constructor', function () {
it('should guess the name from the path', function () {
var resolver = new FsResolver(testPackage);

expect(resolver.getName()).to.equal('github-test-package');
});

it('should make paths absolute and normalized', function () {
var resolver;

resolver = new FsResolver(path.relative(process.cwd(), testPackage));
expect(resolver.getSource()).to.equal(testPackage);

resolver = new FsResolver(testPackage + '/something/..');
expect(resolver.getSource()).to.equal(testPackage);
});
});

describe('.hasNew', function () {
it.skip('should be false if the file modified date hasn\'t changed');
it.skip('should be false if the directory modified date hasn\'t changed');
it.skip('should be true if the file modified date has changed');
it.skip('should be true if the directory modified date has changed');
it.skip('should ignore files specified to be ignored');
});

describe('.resolve', function () {
it('should copy the source file', function (next) {
var resolver = new FsResolver(path.join(testPackage, 'foo'));

resolver.resolve()
.then(function (dir) {
expect(fs.existsSync(path.join(dir, 'foo'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'bar'))).to.be(false);
next();
})
.done();
});

it('should copy the source directory contents', function (next) {
var resolver = new FsResolver(testPackage);

resolver.resolve()
.then(function (dir) {
expect(fs.existsSync(path.join(dir, 'foo'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'bar'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'baz'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'README.md'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'more'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'more', 'more-foo'))).to.be(true);
next();
})
.done();
});

it('should copy the source file permissions', function (next) {
var mode0777,
resolver;

tempSource = path.resolve(__dirname, '../../assets/temp');
resolver = new FsResolver(tempSource);

copy.copyFile(path.join(testPackage, 'foo'), tempSource)
.then(function () {

fs.chmodSync(tempSource, 0777);

mode0777 = fs.statSync(tempSource).mode;
})
.then(resolver.resolve.bind(resolver))
.then(function (dir) {

var stat = fs.statSync(path.join(dir, 'temp'));
expect(stat.mode).to.equal(mode0777);
next();
})
.done();
});

it('should copy the source directory permissions', function (next) {
var mode0777,
resolver;

tempSource = path.resolve(__dirname, '../../assets/github-test-package-copy');
resolver = new FsResolver(tempSource);

copy.copyDir(testPackage, tempSource)
.then(function () {

fs.chmodSync(tempSource, 0777);

mode0777 = fs.statSync(tempSource).mode;
})
.then(resolver.resolve.bind(resolver))
.then(function (dir) {

var stat = fs.statSync(dir);
expect(stat.mode).to.equal(mode0777);
next();
})
.done();
});

it('should not copy ignored paths (to speed up copying)', function (next) {
var resolver = new FsResolver(testPackage);


resolver._applyPkgMeta = function () {};

resolver.resolve()
.then(function (dir) {
expect(fs.existsSync(path.join(dir, 'foo'))).to.be(true);
expect(fs.existsSync(path.join(dir, 'test'))).to.be(false);
next();
})
.done();
});

it('should extract if source is an archive', function (next) {
