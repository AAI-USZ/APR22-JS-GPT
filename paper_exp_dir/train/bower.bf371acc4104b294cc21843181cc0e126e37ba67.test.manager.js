var assert  = require('assert');
var path    = require('path');
var fs      = require('fs');
var Manager = require('../lib/core/manager');
var rimraf  = require('rimraf');
var config  = require('../lib/core/config');
var semver  = require('semver');

describe('manager', function () {
beforeEach(function (done) {
if (fs.existsSync(config.directory)) {
rimraf(config.directory, function (err) {
