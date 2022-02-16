var expect = require('expect.js');
var fs = require('../../../lib/util/fs');
var path = require('path');
var util = require('util');
var rimraf = require('../../../lib/util/rimraf');
var mkdirp = require('mkdirp');
var tmp = require('tmp');
var Q = require('q');
var Logger = require('bower-logger');
var cmd = require('../../../lib/util/cmd');
var copy = require('../../../lib/util/copy');
var Resolver = require('../../../lib/core/resolvers/Resolver');
var defaultConfig = require('../../../lib/config');

describe('Resolver', function() {
var tempDir = path.resolve(__dirname, '../../tmp/tmp');
var testPackage = path.resolve(__dirname, '../../assets/package-a');
var logger;
var dirMode0777;
var config = defaultConfig();

before(function() {
var stat;

mkdirp.sync(tempDir);
stat = fs.statSync(tempDir);
dirMode0777 = stat.mode;
rimraf.sync(tempDir);

logger = new Logger();
});

afterEach(function() {
logger.removeAllListeners();
});

function create(decEndpoint) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
}

return new Resolver(decEndpoint, config, logger);
}

describe('.getSource', function() {
it('should return the resolver source', function() {
var resolver = create('foo');

expect(resolver.getSource()).to.equal('foo');
});
});

describe('.getName', function() {
it('should return the resolver name', function() {
var resolver = create({ source: 'foo', name: 'bar' });

expect(resolver.getName()).to.equal('bar');
});

it('should return the resolver source if none is specified (default guess mechanism)', function() {
var resolver = create('foo');

expect(resolver.getName()).to.equal('foo');
});
});

describe('.getTarget', function() {
it('should return the resolver target', function() {
