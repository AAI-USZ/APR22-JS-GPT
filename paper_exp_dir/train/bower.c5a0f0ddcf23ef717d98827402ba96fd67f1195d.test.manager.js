var assert  = require('assert');
var Manager = require('../lib/core/manager');
var rimraf  = require('rimraf');
var config  = require('../lib/core/config');
var semver  = require('semver');

describe('manager', function () {
beforeEach(function (done) {
var del = 0;

rimraf(config.directory, function (err) {
