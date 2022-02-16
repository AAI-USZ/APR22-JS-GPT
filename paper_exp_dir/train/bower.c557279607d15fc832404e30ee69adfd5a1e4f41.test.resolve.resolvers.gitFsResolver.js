var path = require('path');
var fs = require('fs');
var expect = require('expect.js');
var path = require('path');
var GitFsResolver = require('../../../lib/resolve/resolvers/GitFsResolver');

describe('GitFsResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package');

function cleanInternalResolverCache() {
delete GitFsResolver._versions;
delete GitFsResolver._heads;
delete GitFsResolver._refs;
}

describe('.resolve', function () {
it('should checkout correctly if resolution is a branch', function (next) {
var resolver = new GitFsResolver(testPackage, { target: 'some-branch' });

resolver.resolve()
.then(function (dir) {
expect(dir).to.be.a('string');

var files = fs.readdirSync(dir),
fooContents;

expect(files).to.contain('foo');
expect(files).to.contain('baz');
expect(files).to.contain('baz');

fooContents = fs.readFileSync(path.join(dir, 'foo')).toString();
expect(fooContents).to.equal('foo foo');

next();
})
.done();
});

it('should checkout correctly if resolution is a tag', function (next) {
var resolver = new GitFsResolver(testPackage, { target: '~0.0.1' });

resolver.resolve()
.then(function (dir) {
expect(dir).to.be.a('string');

var files = fs.readdirSync(dir);

expect(files).to.contain('foo');
expect(files).to.contain('bar');
expect(files).to.not.contain('baz');

next();
})
.done();
});

it('should checkout correctly if resolution is a commit', function (next) {
var resolver = new GitFsResolver(testPackage, { target: '7339c38f5874129504b83650fbb2d850394573e9' });

resolver.resolve()
.then(function (dir) {
expect(dir).to.be.a('string');

var files = fs.readdirSync(dir);

expect(files).to.not.contain('foo');
expect(files).to.not.contain('bar');
expect(files).to.not.contain('baz');
expect(files).to.contain('README.md');
next();
})
.done();
});

it('should remove any untracked files and directories', function (next) {
var resolver = new GitFsResolver(testPackage, { target: '7339c38f5874129504b83650fbb2d850394573e9' });

fs.writeFileSync(path.join(testPackage, 'new-file'), 'foo');
fs.mkdir(path.join(testPackage, 'new-dir'));

resolver.resolve()
.then(function (dir) {
expect(dir).to.be.a('string');

var files = fs.readdirSync(dir);
