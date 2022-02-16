

var glob       = require('glob');
var assert     = require('assert');
var rimraf     = require('rimraf');
var path       = require('path');
var fs         = require('fs');
var mkdirp     = require('mkdirp');
var config     = require('../lib/core/config');
var cacheClean = require('../lib/commands/cache-clean');

describe('cache-clean', function () {
function clean(done) {
var del = 0;

rimraf(config.cache, function (err) {
if (err) return done(new Error('Unable to remove cache directory'));
if (++del >= 3) createDirs(done);
});

rimraf(config.links, function (err) {
if (err) return done(new Error('Unable to remove links directory'));
if (++del >= 3) createDirs(done);
});

rimraf(__dirname + '/temp', function (err) {
if (err) return done(new Error('Unable to remove temp directory'));
if (++del >= 3) createDirs(done);
});
}

beforeEach(function (done) {
clean(function (err) {
if (err) return done(err);
fs.mkdirSync(__dirname + '/temp');
done();
});
});
after(clean);

function createDirs(done) {
mkdirp(config.cache, function (err) {
if (err) return done(new Error('Unable to create cache directory'));

mkdirp(config.links, function (err) {
if (err) return done(new Error('Unable to create links directory'));
done();
});
});
}

function simulatePackage(name) {

var dir = path.join(config.cache, name);
var someDir = path.join(dir, 'some-dir');

fs.mkdirSync(dir);
fs.mkdirSync(someDir);
fs.writeFileSync(path.join(dir, 'some-file'), 'bower is awesome');
fs.writeFileSync(path.join(someDir, 'some-other-file'), 'bower is fantastic');
}

function simulateLink(name, linkedPath) {
var dir = path.join(config.links, name);
fs.mkdirSync(linkedPath);
fs.symlinkSync(linkedPath, dir);
}

it('Should emit end event', function (next) {
simulatePackage('some-package');

var cleaner = cacheClean();

cleaner
.on('error', function (err) {
throw err;
})
.on('end', function () {
next();
