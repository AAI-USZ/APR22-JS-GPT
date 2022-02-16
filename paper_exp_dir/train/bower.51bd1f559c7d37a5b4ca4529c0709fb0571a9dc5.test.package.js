var assert  = require('assert');
var path    = require('path');
var fs      = require('fs');
var nock    = require('nock');
var _       = require('lodash');
var rimraf  = require('rimraf');
var async   = require('async');
var config  = require('../lib/core/config');
var Package = require('../lib/core/package');

describe('package', function () {

function clean(done) {
var del = 0;

rimraf(config.directory, function (err) {

if (++del >= 2) done();
});

rimraf(config.cache, function (err) {

if (++del >= 2) done();
});
}

beforeEach(clean);
after(clean);

it('Should resolve git URLs properly', function () {
var pkg = new Package('jquery', 'git://github.com/jquery/jquery.git');
assert.equal(pkg.gitUrl, 'git://github.com/jquery/jquery.git');
});

