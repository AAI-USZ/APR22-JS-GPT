var expect = require('expect.js');
var fs = require('graceful-fs');
var path = require('path');
var mkdirp = require('mkdirp');
var mout = require('mout');
var Q = require('q');
var rimraf = require('rimraf');
var RegistryClient = require('bower-registry-client');
var resolverFactory = require('../../lib/core/resolverFactory');
var FsResolver = require('../../lib/core/resolvers/FsResolver');
var GitFsResolver = require('../../lib/core/resolvers/GitFsResolver');
var GitRemoteResolver = require('../../lib/core/resolvers/GitRemoteResolver');
var UrlResolver = require('../../lib/core/resolvers/UrlResolver');
var defaultConfig = require('../../lib/config');
var Logger = require('../../lib/core/Logger');

describe('resolveFactory', function () {
var tempSource;
var logger = new Logger();
var registryClient = new RegistryClient(mout.object.fillIn({
cache: defaultConfig._registry
}, defaultConfig));

afterEach(function (next) {
logger.removeAllListeners();

if (tempSource) {
rimraf(tempSource, next);
tempSource = null;
} else {
next();
}
});

function callFactory(decEndpoint, config) {
return resolverFactory(decEndpoint, config || defaultConfig, logger, registryClient);
}

it('should recognize git remote endpoints correctly', function (next) {
var promise = Q.resolve();
var endpoints;

endpoints = {

'git://github.com/user/project.git': 'git://github.com/user/project.git',
'git://github.com/user/project.git/': 'git://github.com/user/project.git',


'git+ssh://user@hostname:project': 'ssh://user@hostname:project.git',
'git+ssh://user@hostname:project/': 'ssh://user@hostname:project.git',
'git+ssh://user@hostname:project.git': 'ssh://user@hostname:project.git',
'git+ssh://user@hostname:project.git/': 'ssh://user@hostname:project.git',
'git+ssh://user@hostname/project': 'ssh://user@hostname/project.git',
'git+ssh://user@hostname/project/': 'ssh://user@hostname/project.git',
'git+ssh://user@hostname/project.git': 'ssh://user@hostname/project.git',
'git+ssh://user@hostname/project.git/': 'ssh://user@hostname/project.git',


'git+http://user@hostname/project/blah': 'http://user@hostname/project/blah.git',
'git+http://user@hostname/project/blah/': 'http://user@hostname/project/blah.git',
'git+http://user@hostname/project/blah.git': 'http://user@hostname/project/blah.git',
'git+http://user@hostname/project/blah.git/': 'http://user@hostname/project/blah.git',


'git+https://user@hostname/project/blah': 'https://user@hostname/project/blah.git',
'git+https://user@hostname/project/blah/': 'https://user@hostname/project/blah.git',
'git+https://user@hostname/project/blah.git': 'https://user@hostname/project/blah.git',
'git+https://user@hostname/project/blah.git/': 'https://user@hostname/project/blah.git',


'ssh://user@hostname:project.git': 'ssh://user@hostname:project.git',
'ssh://user@hostname:project.git/': 'ssh://user@hostname:project.git',
'ssh://user@hostname/project.git': 'ssh://user@hostname/project.git',
'ssh://user@hostname/project.git/': 'ssh://user@hostname/project.git',


'http://user@hostname/project.git': 'http://user@hostname/project.git',
'http://user@hostname/project.git/': 'http://user@hostname/project.git',


'https://user@hostname/project.git': 'https://user@hostname/project.git',
'https://user@hostname/project.git/': 'https://user@hostname/project.git',


'bower/bower': 'git://github.com/bower/bower.git'
};

mout.object.forOwn(endpoints, function (value, key) {

promise = promise.then(function () {
return callFactory({ source: key });
})
.then(function (resolver) {
expect(resolver).to.be.a(GitRemoteResolver);
expect(resolver.getSource()).to.equal(value);
expect(resolver.getTarget()).to.equal('*');
});


promise = promise.then(function () {
return callFactory({ source: key, target: 'commit-ish' });
})
.then(function (resolver) {
expect(resolver).to.be.a(GitRemoteResolver);
expect(resolver.getSource()).to.equal(value);
expect(resolver.getTarget()).to.equal('commit-ish');
});


promise = promise.then(function () {
return callFactory({ name: 'foo', source: key });
})
.then(function (resolver) {
expect(resolver).to.be.a(GitRemoteResolver);
expect(resolver.getSource()).to.equal(value);
expect(resolver.getName()).to.equal('foo');
expect(resolver.getTarget()).to.equal('*');
});
});

promise
.then(next.bind(next, null))
.done();
});

it.skip('should recognize GitHub endpoints correctly');

it('should recognize local fs git endpoints correctly', function (next) {
var promise = Q.resolve();
var endpoints;
var temp;

endpoints = {};


temp = path.resolve(__dirname, '../assets/github-test-package');
