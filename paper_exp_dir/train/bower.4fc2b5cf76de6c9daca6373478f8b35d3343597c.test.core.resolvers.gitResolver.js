var expect = require('expect.js');
var util = require('util');
var path = require('path');
var fs = require('graceful-fs');
var chmodr = require('chmodr');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var Q = require('q');
var mout = require('mout');
var Logger = require('bower-logger');
var copy = require('../../../lib/util/copy');
var GitResolver = require('../../../lib/core/resolvers/GitResolver');
var defaultConfig = require('../../../lib/config');

describe('GitResolver', function () {
var tempDir = path.resolve(__dirname, '../../tmp/tmp');
var originalrefs = GitResolver.refs;
var logger;

before(function () {
logger = new Logger();
});

afterEach(function () {
logger.removeAllListeners();
});

function clearResolverRuntimeCache() {
GitResolver.refs = originalrefs;
GitResolver.clearRuntimeCache();
}

function create(decEndpoint) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
}

return new GitResolver(decEndpoint, defaultConfig(), logger);
}

describe('misc', function () {
it.skip('should error out if git is not installed');
it.skip('should setup git template dir to an empty folder');
});

describe('.hasNew', function () {
before(function () {
mkdirp.sync(tempDir);
});

afterEach(function (next) {
clearResolverRuntimeCache();
rimraf(path.join(tempDir, '.bower.json'), next);
});

after(function (next) {
rimraf(tempDir, next);
});


it('should be true when the resolution type is different', function (next) {
var resolver;

var pkgMeta = {
name: 'foo',
version: '0.0.0',
_resolution: {
type: 'version',
tag: '0.0.0',
commit: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
}
};

GitResolver.refs = function () {
return Q.resolve([
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/heads/master'
]);
};

resolver = create('foo');
