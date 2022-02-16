var expect = require('expect.js');
var helpers = require('../helpers');
var nock = require('nock');
var fs = require('../../lib/util/fs');

describe('bower install', function() {

var tempDir = new helpers.TempDir();

var install = helpers.command('install', {
cwd: tempDir.path
});

it('correctly reads arguments', function() {
expect(install.readOptions(['jquery', 'angular', '-F', '-p', '-S', '-D', '-E']))
.to.eql([
['jquery', 'angular'], {
forceLatest: true,
