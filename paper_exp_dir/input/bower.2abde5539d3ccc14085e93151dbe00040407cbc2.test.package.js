var assert  = require('assert');
var path    = require('path');
var fs      = require('fs');
var nock    = require('nock');
var _       = require('lodash');
var rimraf  = require('rimraf');
var config  = require('../lib/core/config');
var Package = require('../lib/core/package');

describe('package', function () {
