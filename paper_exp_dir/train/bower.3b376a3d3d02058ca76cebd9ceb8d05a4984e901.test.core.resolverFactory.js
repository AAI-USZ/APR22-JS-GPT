var expect = require('expect.js');
var fs = require('graceful-fs');
var path = require('path');
var mkdirp = require('mkdirp');
var mout = require('mout');
var Q = require('q');
var rimraf = require('rimraf');
var RegistryClient = require('bower-registry-client');
var Logger = require('bower-logger');
var resolverFactory = require('../../lib/core/resolverFactory');
var resolvers = require('../../lib/core/resolvers');
var defaultConfig = require('../../lib/config');

describe('resolverFactory', function () {
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

'git://hostname.com/user/project.git': 'git://hostname.com/user/project.git',
'git://hostname.com/user/project.git/': 'git://hostname.com/user/project.git',


'git@hostname.com:user/project.git': 'git@hostname.com:user/project.git',
'git@hostname.com:user/project.git/': 'git@hostname.com:user/project.git',


'git+ssh://user@hostname.com:project': 'ssh://user@hostname.com:project.git',
'git+ssh://user@hostname.com:project/': 'ssh://user@hostname.com:project.git',
'git+ssh://user@hostname.com:project.git': 'ssh://user@hostname.com:project.git',
'git+ssh://user@hostname.com:project.git/': 'ssh://user@hostname.com:project.git',
'git+ssh://user@hostname.com/project': 'ssh://user@hostname.com/project.git',
'git+ssh://user@hostname.com/project/': 'ssh://user@hostname.com/project.git',
'git+ssh://user@hostname.com/project.git': 'ssh://user@hostname.com/project.git',
'git+ssh://user@hostname.com/project.git/': 'ssh://user@hostname.com/project.git',


'git+http://user@hostname.com/project/blah': 'http://user@hostname.com/project/blah.git',
'git+http://user@hostname.com/project/blah/': 'http://user@hostname.com/project/blah.git',
'git+http://user@hostname.com/project/blah.git': 'http://user@hostname.com/project/blah.git',
'git+http://user@hostname.com/project/blah.git/': 'http://user@hostname.com/project/blah.git',


'git+https://user@hostname.com/project/blah': 'https://user@hostname.com/project/blah.git',
'git+https://user@hostname.com/project/blah/': 'https://user@hostname.com/project/blah.git',
'git+https://user@hostname.com/project/blah.git': 'https://user@hostname.com/project/blah.git',
'git+https://user@hostname.com/project/blah.git/': 'https://user@hostname.com/project/blah.git',


'ssh://user@hostname.com:project.git': 'ssh://user@hostname.com:project.git',
'ssh://user@hostname.com:project.git/': 'ssh://user@hostname.com:project.git',
'ssh://user@hostname.com/project.git': 'ssh://user@hostname.com/project.git',
'ssh://user@hostname.com/project.git/': 'ssh://user@hostname.com/project.git',


'http://user@hostname.com/project.git': 'http://user@hostname.com/project.git',
'http://user@hostname.com/project.git/': 'http://user@hostname.com/project.git',


'https://user@hostname.com/project.git': 'https://user@hostname.com/project.git',
'https://user@hostname.com/project.git/': 'https://user@hostname.com/project.git',


'bower/bower': 'git://github.com/bower/bower.git'
};

mout.object.forOwn(endpoints, function (value, key) {

promise = promise.then(function () {
return callFactory({ source: key });
})
.then(function (resolver) {
expect(resolver).to.be.a(resolvers.GitRemote);
expect(resolver).to.not.be(resolvers.GitHub);
expect(resolver.getSource()).to.equal(value);
expect(resolver.getTarget()).to.equal('*');
});


promise = promise.then(function () {
return callFactory({ source: key, target: 'commit-ish' });
})
.then(function (resolver) {
expect(resolver).to.be.a(resolvers.GitRemote);
expect(resolver).to.not.be(resolvers.GitHub);
expect(resolver.getSource()).to.equal(value);
expect(resolver.getTarget()).to.equal('commit-ish');
});


promise = promise.then(function () {
return callFactory({ name: 'foo', source: key });
})
.then(function (resolver) {
expect(resolver).to.be.a(resolvers.GitRemote);
expect(resolver).to.not.be(resolvers.GitHub);
expect(resolver.getSource()).to.equal(value);
expect(resolver.getName()).to.equal('foo');
expect(resolver.getTarget()).to.equal('*');
});
});

promise
.then(next.bind(next, null))
.done();
});

it('should recognize public GitHub endpoints correctly (git://)', function (next) {
var promise = Q.resolve();
var endpoints;

endpoints = {

'git://github.com/user/project/blah.git': 'git://github.com/user/project/blah.git',
'git://github.com/user/project/blah.git/': 'git://github.com/user/project/blah.git',


'git@github.com:user/project/blah.git': 'git@github.com:user/project/blah.git',
'git@github.com:user/project/blah.git/': 'git@github.com:user/project/blah.git',


'git+ssh://user@github.com:project/blah': 'ssh://user@github.com:project/blah.git',
'git+ssh://user@github.com:project/blah/': 'ssh://user@github.com:project/blah.git',
'git+ssh://user@github.com:project/blah.git': 'ssh://user@github.com:project/blah.git',
'git+ssh://user@github.com:project/blah.git/': 'ssh://user@github.com:project/blah.git',
'git+ssh://user@github.com/project/blah': 'ssh://user@github.com/project/blah.git',
'git+ssh://user@github.com/project/blah/': 'ssh://user@github.com/project/blah.git',
