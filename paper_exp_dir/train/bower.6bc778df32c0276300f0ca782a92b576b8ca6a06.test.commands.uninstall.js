var path = require('path');
var mkdirp = require('mkdirp');
var expect = require('expect.js');
var fs = require('../../lib/util/fs');

var helpers = require('../helpers');
var uninstall = helpers.command('uninstall');

describe('bower uninstall', function() {
var tempDir = new helpers.TempDir({
'bower.json': {
name: 'hello-world',
dependencies: {
underscore: '*'
}
}
});

beforeEach(function() {
