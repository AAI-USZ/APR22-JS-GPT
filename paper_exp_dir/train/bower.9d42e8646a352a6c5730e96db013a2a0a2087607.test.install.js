

var assert  = require('assert');
var fs      = require('fs');
var path    = require('path');
var rimraf  = require('rimraf');

var _       = require('lodash');

var config  = require('../lib/core/config.js');
var install = require('../lib/commands/install');

describe('install', function () {
var cwd = process.cwd();
var testDir = __dirname + '/install_test';

function clean(done) {
var del = 0;

rimraf(testDir, function () {

if (++del >= 3) done();
});

rimraf(config.directory, function () {

if (++del >= 3) done();
});

rimraf(config.cache, function () {

if (++del >= 3) done();
});
}

beforeEach(function (done) {
clean(function () {
process.chdir(cwd);
done();
});
});
after(function (done) {
clean(function () {
process.chdir(cwd);
done();
});
});

it('Should have line method', function () {
assert(!!install.line);
});

