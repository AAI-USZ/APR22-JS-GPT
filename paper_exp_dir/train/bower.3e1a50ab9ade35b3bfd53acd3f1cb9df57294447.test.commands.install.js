var expect = require('expect.js');
var object = require('mout').object;

var helpers = require('../helpers');
var commands = helpers.require('lib/index').commands;

describe('bower install', function () {

var tempDir = new helpers.TempDir();

var package = new helpers.TempDir({
'bower.json': {
name: 'package'
}
}).prepare();

var gitPackage = new helpers.TempDir();

var install = function(packages, options, config) {
config = object.merge(config || {}, {
cwd: tempDir.path
});

var logger = commands.install(
packages, options, config
);
