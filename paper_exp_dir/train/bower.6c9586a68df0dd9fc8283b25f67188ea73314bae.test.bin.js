var spawn      = require('child_process').spawn;
var rimraf     = require('rimraf');
var fs         = require('fs');
var assert     = require('assert');
var fileExists = require('../lib/util/file-exists');

describe('bin', function () {
var testDir = __dirname + '/install_test';

function clean(done) {
