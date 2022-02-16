

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
