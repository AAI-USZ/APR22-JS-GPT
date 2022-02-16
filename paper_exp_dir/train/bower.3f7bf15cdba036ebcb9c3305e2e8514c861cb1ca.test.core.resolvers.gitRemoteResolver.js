var expect = require('expect.js');
var path = require('path');
var fs = require('graceful-fs');
var GitRemoteResolver = require('../../../lib/core/resolvers/GitRemoteResolver');
var Logger = require('../../../lib/core/Logger');
var defaultConfig = require('../../../lib/config');

describe('GitRemoteResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package');
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
expect(resolver.getName()).to.equal('github-test-package');

resolver = create('git://github.com/twitter/bower.git');
expect(resolver.getName()).to.equal('bower');

resolver = create('git://github.com/twitter/bower');
expect(resolver.getName()).to.equal('bower');

resolver = create('git://github.com');
expect(resolver.getName()).to.equal('github.com');
});

it('should ensure .git in the source (except if protocol is file://)', function () {
var resolver;

resolver = create('git://github.com/twitter/bower');
expect(resolver.getSource()).to.equal('git://github.com/twitter/bower.git');

resolver = create('git://github.com/twitter/bower.git');
expect(resolver.getSource()).to.equal('git://github.com/twitter/bower.git');

resolver = create('git://github.com/twitter/bower.git/');
expect(resolver.getSource()).to.equal('git://github.com/twitter/bower.git');

resolver = create('file://' + testPackage);
expect(resolver.getSource()).to.equal('file://' + testPackage);
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
var resolver = create({ source: 'file://' + testPackage, target: '7339c38f5874129504b83650fbb2d850394573e9' });

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

it.skip('should report progress when it takes too long to clone');
});

describe('#refs', function () {
afterEach(clearResolverRuntimeCache);

it('should resolve to the references of the remote repository', function (next) {
GitRemoteResolver.refs('file://' + testPackage)
.then(function (refs) {
