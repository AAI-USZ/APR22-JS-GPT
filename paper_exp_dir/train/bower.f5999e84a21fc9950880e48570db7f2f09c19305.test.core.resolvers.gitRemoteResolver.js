var expect = require('expect.js');
var path = require('path');
var fs = require('graceful-fs');
var Logger = require('bower-logger');
var GitRemoteResolver = require('../../../lib/core/resolvers/GitRemoteResolver');
var defaultConfig = require('../../../lib/config');

describe('GitRemoteResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/package-a');
var logger;

before(function () {
logger = new Logger();
});

afterEach(function () {
logger.removeAllListeners();
});

function clearResolverRuntimeCache() {
GitRemoteResolver.clearRuntimeCache();
}

function create(decEndpoint, config) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
}

return new GitRemoteResolver(decEndpoint, config || defaultConfig, logger);
}

describe('.constructor', function () {
it('should guess the name from the path', function () {
var resolver;

resolver = create('file://' + testPackage);
expect(resolver.getName()).to.equal('package-a');

resolver = create('git://github.com/twitter/bower.git');
expect(resolver.getName()).to.equal('bower');

resolver = create('git://github.com/twitter/bower');
expect(resolver.getName()).to.equal('bower');

resolver = create('git://github.com');
expect(resolver.getName()).to.equal('github.com');
});
});

describe('.resolve', function () {
it('should checkout correctly if resolution is a branch', function (next) {
var resolver = create({ source: 'file://' + testPackage, target: 'some-branch' });

resolver.resolve()
.then(function (dir) {
expect(dir).to.be.a('string');

var files = fs.readdirSync(dir);
var fooContents;

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
var resolver = create({ source: 'file://' + testPackage, target: '~0.0.1' });

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
var resolver = create({ source: 'file://' + testPackage, target: 'bdf51ece75e20cf404e49286727b7e92d33e9ad0' });

resolver.resolve()
.then(function (dir) {
expect(dir).to.be.a('string');

var files = fs.readdirSync(dir);

expect(files).to.not.contain('foo');
expect(files).to.not.contain('bar');
expect(files).to.not.contain('baz');
expect(files).to.contain('.master');
next();
})
.done();
});

it.skip('should handle gracefully servers that do not support --depth=1');
it.skip('should report progress when it takes too long to clone');
});

describe('#refs', function () {
afterEach(clearResolverRuntimeCache);

it('should resolve to the references of the remote repository', function (next) {
GitRemoteResolver.refs('file://' + testPackage)
.then(function (refs) {
