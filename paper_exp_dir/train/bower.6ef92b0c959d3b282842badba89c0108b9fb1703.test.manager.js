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
rimraf(config.directory, function (err) {
if (err) {
throw new Error('Unable to delete local directory.');
}
done();
