var expect = require('expect.js');
var path = require('path');
var fs = require('graceful-fs');
var path = require('path');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var Q = require('q');
var Logger = require('bower-logger');
var cmd = require('../../../lib/util/cmd');
var copy = require('../../../lib/util/copy');
var FsResolver = require('../../../lib/core/resolvers/FsResolver');
var defaultConfig = require('../../../lib/config');

describe('FsResolver', function () {
var tempSource;
var logger;
var testPackage = path.resolve(__dirname, '../../assets/package-a');

before(function (next) {
logger = new Logger();


cmd('git', ['checkout', '0.2.1'], { cwd: testPackage })
.then(next.bind(next, null), next);
});

afterEach(function (next) {
logger.removeAllListeners();

if (tempSource) {
rimraf(tempSource, next);
tempSource = null;
} else {
next();
}
});

function create(decEndpoint) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
}

return new FsResolver(decEndpoint, defaultConfig(), logger);
}

describe('.constructor', function () {
it('should guess the name from the path', function () {
var resolver = create(path.resolve('../../assets/package-zip.zip'));

expect(resolver.getName()).to.equal('package-zip');
});

it('should make paths absolute and normalized', function () {
var resolver;

resolver = create(path.relative(process.cwd(), testPackage));
expect(resolver.getSource()).to.equal(testPackage);

resolver = create(testPackage + '/something/..');
expect(resolver.getSource()).to.equal(testPackage);
});

it.skip('should use config.cwd for resolving relative paths');

it('should error out if a target was specified', function (next) {
var resolver;

try {
resolver = create({ source: testPackage, target: '0.0.1' });
} catch (err) {
expect(err).to.be.an(Error);
expect(err.message).to.match(/can\'t resolve targets/i);
expect(err.code).to.equal('ENORESTARGET');
return next();
}

next(new Error('Should have thrown'));
});
});

describe('.hasNew', function () {
it('should resolve always to true (for now..)', function (next) {
var resolver = create(testPackage);

var pkgMeta = {
name: 'test'
};

resolver.hasNew(pkgMeta)
.then(function (hasNew) {
expect(hasNew).to.be(true);
next();
})
.done();
