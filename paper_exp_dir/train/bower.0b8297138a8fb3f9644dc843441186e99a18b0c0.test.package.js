var assert  = require('assert'),
path    = require('path'),
fs      = require('fs'),
nock    = require('nock'),
_       = require('lodash'),
Package = require('../lib/core/package');

describe('package', function () {
it('Should resolve git URLs properly', function () {
var pkg = new Package('jquery', 'git://github.com/jquery/jquery.git');
