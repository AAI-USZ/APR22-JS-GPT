

var assert  = require('assert');
var fs      = require('fs');
var path    = require('path');
var nock    = require('nock');
var _       = require('lodash');
var rimraf  = require('rimraf');
var glob    = require('glob');
var async   = require('async');
var config  = require('../lib/core/config');
var Package = require('../lib/core/package');

describe('package', function () {
var savedConfigJson = config.json;
var savedConfigShorthandResolver = config.shorthand_resolver;

function clean(done) {

var del = 0;


config.json = savedConfigJson;


config.shorthand_resolver = savedConfigShorthandResolver;

rimraf(config.directory, function () {

if (++del >= 2) done();
});

