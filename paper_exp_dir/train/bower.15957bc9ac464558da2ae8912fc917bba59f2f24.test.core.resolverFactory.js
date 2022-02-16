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
'git+ssh://user@github.com/project/blah.git': 'ssh://user@github.com/project/blah.git',
'git+ssh://user@github.com/project/blah.git/': 'ssh://user@github.com/project/blah.git',


'git+http://user@github.com/project/blah': 'http://user@github.com/project/blah.git',
'git+http://user@github.com/project/blah/': 'http://user@github.com/project/blah.git',
'git+http://user@github.com/project/blah.git': 'http://user@github.com/project/blah.git',
'git+http://user@github.com/project/blah.git/': 'http://user@github.com/project/blah.git',


'git+https://user@github.com/project/blah': 'https://user@github.com/project/blah.git',
'git+https://user@github.com/project/blah/': 'https://user@github.com/project/blah.git',
'git+https://user@github.com/project/blah.git': 'https://user@github.com/project/blah.git',
'git+https://user@github.com/project/blah.git/': 'https://user@github.com/project/blah.git',


'ssh://user@github.com:project/blah.git': 'ssh://user@github.com:project/blah.git',
'ssh://user@github.com:project/blah.git/': 'ssh://user@github.com:project/blah.git',
'ssh://user@github.com/project/blah.git': 'ssh://user@github.com/project/blah.git',
'ssh://user@github.com/project/blah.git/': 'ssh://user@github.com/project/blah.git',


'http://user@github.com/project/blah.git': 'http://user@github.com/project/blah.git',
'http://user@github.com/project/blah.git/': 'http://user@github.com/project/blah.git',


'https://user@github.com/project/blah.git': 'https://user@github.com/project/blah.git',
'https://user@github.com/project/blah.git/': 'https://user@github.com/project/blah.git',


'bower/bower': 'git://github.com/bower/bower.git'
};

mout.object.forOwn(endpoints, function (value, key) {

promise = promise.then(function () {
return callFactory({ source: key });
})
.then(function (resolver) {
if (value) {
expect(resolver).to.be.a(resolvers.GitHub);
expect(resolver.getSource()).to.equal(value);
expect(resolver.getTarget()).to.equal('*');
} else {
expect(resolver).to.not.be.a(resolvers.GitHub);
}
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

it('should recognize local fs files/folder endpoints correctly', function (next) {
var promise = Q.resolve();
var endpoints;
var temp;

tempSource = path.resolve(__dirname, '../assets/tmp');
mkdirp.sync(tempSource);
fs.writeFileSync(path.join(tempSource, '.git'), 'foo');
fs.writeFileSync(path.join(tempSource, 'file.with.multiple.dots'), 'foo');

endpoints = {};


endpoints[tempSource] = tempSource;

endpoints[__dirname + '/../assets/tmp'] = tempSource;


temp = path.resolve(__dirname, '../assets/test-temp-dir');
endpoints[temp] = temp;

endpoints[__dirname + '/../assets/test-temp-dir'] = temp;


temp = path.resolve(__dirname, '../assets/package-zip.zip');
endpoints[temp] = temp;

endpoints[__dirname + '/../assets/package-zip.zip'] = temp;


endpoints['../'] = path.normalize(__dirname + '/../../..');


endpoints['./test/assets'] = path.join(__dirname, '../assets');



endpoints['./test'] = path.join(__dirname, '..');


temp = path.join(tempSource, 'file.with.multiple.dots');
endpoints[temp] = temp;

mout.object.forOwn(endpoints, function (value, key) {

promise = promise.then(function () {
return callFactory({ source: key });
})
.then(function (resolver) {
expect(resolver.getSource()).to.equal(value);
expect(resolver).to.be.a(resolvers.Fs);
expect(resolver.getTarget()).to.equal('*');
});


promise = promise.then(function () {
return callFactory({ name: 'foo', source: key });
})
.then(function (resolver) {
expect(resolver).to.be.a(resolvers.Fs);
expect(resolver.getName()).to.equal('foo');
expect(resolver.getTarget()).to.equal('*');
expect(resolver.getSource()).to.equal(value);
});
});


promise
.then(next.bind(next, null))
.done();
});

it('should recognize URL endpoints correctly', function (next) {
var promise = Q.resolve();
var endpoints;

endpoints = [
'http://bower.io/foo.js',
'https://bower.io/foo.js'
];

endpoints.forEach(function (source) {

promise = promise.then(function () {
return callFactory({ source: source });
})
.then(function (resolver) {
expect(resolver).to.be.a(resolvers.Url);
expect(resolver.getSource()).to.equal(source);
});


promise = promise.then(function () {
return callFactory({ name: 'foo', source: source });
})
.then(function (resolver) {
expect(resolver).to.be.a(resolvers.Url);
expect(resolver.getName()).to.equal('foo');
expect(resolver.getSource()).to.equal(source);
});
});

promise
.then(next.bind(next, null))
.done();
});

it('should recognize registry endpoints correctly', function (next) {

fs.writeFileSync('dejavu', 'foo');

callFactory({ source: 'dejavu' })
.then(function (resolver) {
expect(resolver).to.be.a(resolvers.GitRemote);
expect(resolver.getSource()).to.equal('git://github.com/IndigoUnited/dejavu.git');
expect(resolver.getTarget()).to.equal('*');
})
.then(function () {

return callFactory({ source: 'dejavu', name: 'foo' })
.then(function (resolver) {
expect(resolver).to.be.a(resolvers.GitRemote);
expect(resolver.getSource()).to.equal('git://github.com/IndigoUnited/dejavu.git');
expect(resolver.getName()).to.equal('foo');
expect(resolver.getTarget()).to.equal('*');
});
})
.then(function () {

return callFactory({ source: 'dejavu', target: '~2.0.0' })
.then(function (resolver) {
expect(resolver).to.be.a(resolvers.GitRemote);
expect(resolver.getTarget()).to.equal('~2.0.0');

next();
});
})
.done();
});

it('should error out if the package was not found in the registry', function (next) {
callFactory({ source: 'some-package-that-will-never-exist' })
.then(function () {
throw new Error('Should have failed');
}, function (err) {
expect(err).to.be.an(Error);
expect(err.code).to.equal('ENOTFOUND');
expect(err.message).to.contain('some-package-that-will-never-exist');

next();
})
.done();
});

it('should set registry to true on the decomposed endpoint if fetched from the registry', function (next) {
var decEndpoint = { source: 'dejavu' };

callFactory(decEndpoint)
.then(function () {
expect(decEndpoint.registry).to.be(true);
next();
})
.done();
});

it('should use the configured shorthand resolver', function (next) {
callFactory({ source: 'bower/bower' })
.then(function (resolver) {
var config;
expect(resolver.getSource()).to.equal('git://github.com/bower/bower.git');

config = mout.object.fillIn({
shorthandResolver: 'git://bower.io/{{owner}}/{{package}}/{{shorthand}}'
}, defaultConfig);

return callFactory({ source: 'IndigoUnited/promptly' }, config);
})
.then(function (resolver) {
expect(resolver.getSource()).to.equal('git://bower.io/IndigoUnited/promptly/IndigoUnited/promptly.git');
next();
})
.done();
});

it('should error out if there\'s no suitable resolver for a given source', function (next) {
resolverFactory({ source: 'some-package-that-will-never-exist' }, defaultConfig, logger)
.then(function () {
throw new Error('Should have failed');
}, function (err) {
expect(err).to.be.an(Error);
expect(err.code).to.be('ENORESOLVER');
expect(err.message).to.contain('appropriate resolver');
next();
})
.done();
});

it.skip('should use config.cwd when resolving relative paths');

it('should not swallow constructor errors when instantiating resolvers', function (next) {
var promise = Q.resolve();
var endpoints;


endpoints = [
'http://bower.io/foo.js',
path.resolve(__dirname, '../assets/test-temp-dir')
];

endpoints.forEach(function (source) {
promise = promise.then(function () {
return callFactory({ source: source, target: 'bleh' });
})
.then(function () {
throw new Error('Should have failed');
}, function (err) {
expect(err).to.be.an(Error);
expect(err.message).to.match(/can't resolve targets/i);
expect(err.code).to.equal('ENORESTARGET');
});
});

promise
.then(next.bind(next, null))
.done();
});

describe('.clearRuntimeCache', function () {
it('should call every resolver static method that clears the runtime cache', function () {
var originalMethods = {};
var called = [];
var error;

mout.object.forOwn(resolvers, function (ConcreteResolver, key) {
originalMethods[key] = ConcreteResolver.clearRuntimeCache;
ConcreteResolver.clearRuntimeCache = function () {
called.push(key);
return originalMethods[key].apply(this, arguments);
};
});

try {
resolverFactory.clearRuntimeCache();
} catch (e) {
error = e;
} finally {
mout.object.forOwn(resolvers, function (ConcreteResolver, key) {
ConcreteResolver.clearRuntimeCache = originalMethods[key];
});
}

if (error) {
throw error;
}

expect(called.sort()).to.eql(Object.keys(resolvers).sort());
});
});
});
