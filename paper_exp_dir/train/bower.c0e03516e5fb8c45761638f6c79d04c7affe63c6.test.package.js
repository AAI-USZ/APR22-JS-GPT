var assert  = require('assert');
var path    = require('path');
var fs      = require('fs');
var _       = require('lodash');
var rimraf   = require('rimraf');
var config   = require('../lib/core/config');
var Package = require('../lib/core/package');

describe('package', function () {
it('Should resolve git URLs properly', function () {
var pkg = new Package('jquery', 'git://github.com/jquery/jquery.git');
assert.equal(pkg.gitUrl, 'git://github.com/jquery/jquery.git');
});

