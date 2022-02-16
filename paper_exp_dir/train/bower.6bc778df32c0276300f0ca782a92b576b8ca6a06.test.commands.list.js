var expect = require('expect.js');
var object = require('mout').object;
var path = require('path');

var helpers = require('../helpers');

var commands = {
install: helpers.command('install'),
list: helpers.command('list')
};

describe('bower list', function() {
var tempDir = new helpers.TempDir();

var gitPackage = new helpers.TempDir();

var install = function(packages, options, config) {
config = object.merge(config || {}, {
cwd: tempDir.path
});

