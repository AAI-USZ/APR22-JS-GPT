

var assert  = require('assert');
var fs      = require('fs');
var nock    = require('nock');
var _       = require('lodash');
var rimraf  = require('rimraf');
var async   = require('async');
var config  = require('../lib/core/config');
var Package = require('../lib/core/package');
