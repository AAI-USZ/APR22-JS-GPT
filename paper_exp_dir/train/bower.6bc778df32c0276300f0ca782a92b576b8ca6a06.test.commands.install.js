var expect = require('expect.js');
var path = require('path');
var helpers = require('../helpers');
var nock = require('nock');
var rimraf = require('rimraf');
var fs = require('../../lib/util/fs');
var tar = require('tar-fs');
var destroy = require('destroy');
var Q = require('q');

describe('bower install', function() {
var tempDir = new helpers.TempDir();

var install = helpers.command('install', {
cwd: tempDir.path
});

it('correctly reads arguments', function() {
expect(
install.readOptions([
