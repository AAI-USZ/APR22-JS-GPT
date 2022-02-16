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
'git@xxxxgithub.com:user:project.git',
'git@xxxxgithub.com:user/project.git',
'git+ssh://git@xxxxgithub.com:user/project',
'git+ssh://git@xxxxgithub.com/user/project',
'git+http://user@xxxxgithub.com/user/project',
'git+https://user@xxxxgithub.com/user/project',
'ssh://git@xxxxgithub.com:user/project.git',
'ssh://git@xxxxgithub.com/user/project.git',
'http://xxxxgithub.com/user/project.git',
'https://xxxxgithub.com/user/project.git',
'http://user@xxxxgithub.com/user/project.git',
'https://user@xxxxgithub.com/user/project.git'
];


mout.object.forOwn(gitHub, function (value, key) {

promise = promise.then(function () {
return callFactory({ source: key });
})
.then(function (resolver) {
expect(resolver).to.be.a(resolvers.GitHub);
expect(resolver.getSource()).to.equal(value);
expect(resolver.getTarget()).to.equal('*');
});


promise = promise.then(function () {
return callFactory({ source: key, target: 'commit-ish' });
})
.then(function (resolver) {
if (value) {
expect(resolver).to.be.a(resolvers.GitHub);
expect(resolver.getSource()).to.equal(value);
expect(resolver.getTarget()).to.equal('commit-ish');
} else {
expect(resolver).to.not.be.a(resolvers.GitHub);
}
});


promise = promise.then(function () {
return callFactory({ name: 'foo', source: key });
})
.then(function (resolver) {
if (value) {
expect(resolver).to.be.a(resolvers.GitHub);
expect(resolver.getSource()).to.equal(value);
expect(resolver.getName()).to.equal('foo');
expect(resolver.getTarget()).to.equal('*');
} else {
expect(resolver).to.not.be.a(resolvers.GitHub);
}
});
});


nonGitHub.forEach(function (value) {
promise = promise.then(function () {
return callFactory({ source: value });
})
.then(function (resolver) {
expect(resolver).to.not.be.a(resolvers.GitHub);
expect(resolver).to.be.a(resolvers.GitRemote);
});
});

promise
.then(next.bind(next, null))
.done();
});

it('should recognize local fs git endpoints correctly', function (next) {
var promise = Q.resolve();
var endpoints;
var temp;

endpoints = {};


temp = path.resolve(__dirname, '../assets/package-a');
endpoints[temp] = temp;



temp = path.resolve(__dirname, '../assets/package-a') + '/';
endpoints[temp] = temp;


endpoints[__dirname + '/../assets/package-a'] = temp;



mout.object.forOwn(endpoints, function (value, key) {

promise = promise.then(function () {
return callFactory({ source: key });
})
.then(function (resolver) {
expect(resolver).to.be.a(resolvers.GitFs);
expect(resolver.getTarget()).to.equal('*');
});


promise = promise.then(function () {
return callFactory({ name: 'foo', source: key });
})
.then(function (resolver) {
expect(resolver).to.be.a(resolvers.GitFs);
expect(resolver.getName()).to.equal('foo');
expect(resolver.getTarget()).to.equal('*');
});
});

promise
.then(next.bind(next, null))
.done();
});

it('should recognize svn remote endpoints correctly', function (next) {
var promise = Q.resolve();
var endpoints;

endpoints = {

'svn://hostname.com/user/project': 'http://hostname.com/user/project',
'svn://hostname.com/user/project/': 'http://hostname.com/user/project',


'svn://svn@hostname.com:user/project': 'http://svn@hostname.com:user/project',
'svn://svn@hostname.com:user/project/': 'http://svn@hostname.com:user/project',


'svn+http://hostname.com/project/blah': 'http://hostname.com/project/blah',
'svn+http://hostname.com/project/blah/': 'http://hostname.com/project/blah',
'svn+http://user@hostname.com/project/blah': 'http://user@hostname.com/project/blah',
'svn+http://user@hostname.com/project/blah/': 'http://user@hostname.com/project/blah',


'svn+https://hostname.com/project/blah': 'https://hostname.com/project/blah',
'svn+https://hostname.com/project/blah/': 'https://hostname.com/project/blah',
'svn+https://user@hostname.com/project/blah': 'https://user@hostname.com/project/blah',
'svn+https://user@hostname.com/project/blah/': 'https://user@hostname.com/project/blah',


'svn+ssh://hostname.com/project/blah': 'svn+ssh://hostname.com/project/blah',
'svn+ssh://hostname.com/project/blah/': 'svn+ssh://hostname.com/project/blah',
'svn+ssh://user@hostname.com/project/blah': 'svn+ssh://user@hostname.com/project/blah',
'svn+ssh://user@hostname.com/project/blah/': 'svn+ssh://user@hostname.com/project/blah',


'svn+file:///project/blah': 'file:///project/blah',
'svn+file:///project/blah/': 'file:///project/blah'
};

mout.object.forOwn(endpoints, function (value, key) {

promise = promise.then(function () {
return callFactory({ source: key });
