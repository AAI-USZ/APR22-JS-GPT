var assert  = require('assert');
var path    = require('path');


var Manager = require('../lib/core/manager');
var rimraf  = require('rimraf');
var config  = require('../lib/core/config');
var semver  = require('semver');
var fs      = require('fs');
var path    = require('path');

describe('manager', function () {
beforeEach(function (done) {
var del = 0;

rimraf(config.directory, function (err) {

if (++del >= 2) done();
});

rimraf(config.cache, function (err) {

if (++del >= 2) done();
});
});

