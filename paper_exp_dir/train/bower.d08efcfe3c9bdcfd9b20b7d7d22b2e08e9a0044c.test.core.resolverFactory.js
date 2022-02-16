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

after(function (next) {
rimraf('dejavu', next);
});

function callFactory(decEndpoint, config) {
return resolverFactory(decEndpoint, config || defaultConfig, logger, registryClient);
}

it('should recognize git remote endpoints correctly', function (next) {
var promise = Q.resolve();
var endpoints;

endpoints = {

'git://hostname.com/user/project': 'git://hostname.com/user/project',
'git://hostname.com/user/project/': 'git://hostname.com/user/project',
'git://hostname.com/user/project.git': 'git://hostname.com/user/project.git',
'git://hostname.com/user/project.git/': 'git://hostname.com/user/project.git',


'git@hostname.com:user/project': 'git@hostname.com:user/project',
'git@hostname.com:user/project/': 'git@hostname.com:user/project',
'git@hostname.com:user/project.git': 'git@hostname.com:user/project.git',
'git@hostname.com:user/project.git/': 'git@hostname.com:user/project.git',


'git+ssh://user@hostname.com:project': 'ssh://user@hostname.com:project',
'git+ssh://user@hostname.com:project/': 'ssh://user@hostname.com:project',
'git+ssh://user@hostname.com:project.git': 'ssh://user@hostname.com:project.git',
'git+ssh://user@hostname.com:project.git/': 'ssh://user@hostname.com:project.git',
'git+ssh://user@hostname.com/project': 'ssh://user@hostname.com/project',
'git+ssh://user@hostname.com/project/': 'ssh://user@hostname.com/project',
'git+ssh://user@hostname.com/project.git': 'ssh://user@hostname.com/project.git',
'git+ssh://user@hostname.com/project.git/': 'ssh://user@hostname.com/project.git',


'git+http://hostname.com/project/blah': 'http://hostname.com/project/blah',
'git+http://hostname.com/project/blah/': 'http://hostname.com/project/blah',
'git+http://hostname.com/project/blah.git': 'http://hostname.com/project/blah.git',
'git+http://hostname.com/project/blah.git/': 'http://hostname.com/project/blah.git',
'git+http://user@hostname.com/project/blah': 'http://user@hostname.com/project/blah',
'git+http://user@hostname.com/project/blah/': 'http://user@hostname.com/project/blah',
'git+http://user@hostname.com/project/blah.git': 'http://user@hostname.com/project/blah.git',
'git+http://user@hostname.com/project/blah.git/': 'http://user@hostname.com/project/blah.git',


'git+https://hostname.com/project/blah': 'https://hostname.com/project/blah',
'git+https://hostname.com/project/blah/': 'https://hostname.com/project/blah',
'git+https://hostname.com/project/blah.git': 'https://hostname.com/project/blah.git',
'git+https://hostname.com/project/blah.git/': 'https://hostname.com/project/blah.git',
'git+https://user@hostname.com/project/blah': 'https://user@hostname.com/project/blah',
'git+https://user@hostname.com/project/blah/': 'https://user@hostname.com/project/blah',
'git+https://user@hostname.com/project/blah.git': 'https://user@hostname.com/project/blah.git',
'git+https://user@hostname.com/project/blah.git/': 'https://user@hostname.com/project/blah.git',


'ssh://user@hostname.com:project.git': 'ssh://user@hostname.com:project.git',
'ssh://user@hostname.com:project.git/': 'ssh://user@hostname.com:project.git',
'ssh://user@hostname.com/project.git': 'ssh://user@hostname.com/project.git',
'ssh://user@hostname.com/project.git/': 'ssh://user@hostname.com/project.git',


'http://hostname.com/project.git': 'http://hostname.com/project.git',
'http://hostname.com/project.git/': 'http://hostname.com/project.git',
'http://user@hostname.com/project.git': 'http://user@hostname.com/project.git',
'http://user@hostname.com/project.git/': 'http://user@hostname.com/project.git',


'https://hostname.com/project.git': 'https://hostname.com/project.git',
'https://hostname.com/project.git/': 'https://hostname.com/project.git',
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

it('should recognize GitHub endpoints correctly', function (next) {
var promise = Q.resolve();
var gitHub;
var nonGitHub;

gitHub = {

'git://github.com/user/project': 'git://github.com/user/project.git',
'git://github.com/user/project/': 'git://github.com/user/project.git',
'git://github.com/user/project.git': 'git://github.com/user/project.git',
'git://github.com/user/project.git/': 'git://github.com/user/project.git',


'git@github.com:user/project': 'git@github.com:user/project.git',
'git@github.com:user/project/': 'git@github.com:user/project.git',
'git@github.com:user/project.git': 'git@github.com:user/project.git',
'git@github.com:user/project.git/': 'git@github.com:user/project.git',


'git+ssh://git@github.com:project/blah': 'ssh://git@github.com:project/blah.git',
'git+ssh://git@github.com:project/blah/': 'ssh://git@github.com:project/blah.git',
'git+ssh://git@github.com:project/blah.git': 'ssh://git@github.com:project/blah.git',
'git+ssh://git@github.com:project/blah.git/': 'ssh://git@github.com:project/blah.git',
'git+ssh://git@github.com/project/blah': 'ssh://git@github.com/project/blah.git',
'git+ssh://git@github.com/project/blah/': 'ssh://git@github.com/project/blah.git',
'git+ssh://git@github.com/project/blah.git': 'ssh://git@github.com/project/blah.git',
'git+ssh://git@github.com/project/blah.git/': 'ssh://git@github.com/project/blah.git',


'git+http://github.com/project/blah': 'http://github.com/project/blah.git',
'git+http://github.com/project/blah/': 'http://github.com/project/blah.git',
'git+http://github.com/project/blah.git': 'http://github.com/project/blah.git',
'git+http://github.com/project/blah.git/': 'http://github.com/project/blah.git',
'git+http://user@github.com/project/blah': 'http://user@github.com/project/blah.git',
'git+http://user@github.com/project/blah/': 'http://user@github.com/project/blah.git',
'git+http://user@github.com/project/blah.git': 'http://user@github.com/project/blah.git',
'git+http://user@github.com/project/blah.git/': 'http://user@github.com/project/blah.git',


'git+https://github.com/project/blah': 'https://github.com/project/blah.git',
'git+https://github.com/project/blah/': 'https://github.com/project/blah.git',
'git+https://github.com/project/blah.git': 'https://github.com/project/blah.git',
'git+https://github.com/project/blah.git/': 'https://github.com/project/blah.git',
'git+https://user@github.com/project/blah': 'https://user@github.com/project/blah.git',
'git+https://user@github.com/project/blah/': 'https://user@github.com/project/blah.git',
'git+https://user@github.com/project/blah.git': 'https://user@github.com/project/blah.git',
'git+https://user@github.com/project/blah.git/': 'https://user@github.com/project/blah.git',


'ssh://git@github.com:project/blah.git': 'ssh://git@github.com:project/blah.git',
'ssh://git@github.com:project/blah.git/': 'ssh://git@github.com:project/blah.git',
'ssh://git@github.com/project/blah.git': 'ssh://git@github.com/project/blah.git',
'ssh://git@github.com/project/blah.git/': 'ssh://git@github.com/project/blah.git',


'http://github.com/project/blah.git': 'http://github.com/project/blah.git',
'http://github.com/project/blah.git/': 'http://github.com/project/blah.git',
'http://user@github.com/project/blah.git': 'http://user@github.com/project/blah.git',
'http://user@github.com/project/blah.git/': 'http://user@github.com/project/blah.git',


'https://github.com/project/blah.git': 'https://github.com/project/blah.git',
'https://github.com/project/blah.git/': 'https://github.com/project/blah.git',
'https://user@github.com/project/blah.git': 'https://user@github.com/project/blah.git',
'https://user@github.com/project/blah.git/': 'https://user@github.com/project/blah.git',


'bower/bower': 'git://github.com/bower/bower.git'
};

nonGitHub = [
'git://github.com/user/project/bleh.git',
'git://xxxxgithub.com/user/project.git',
