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

var installLogger = function(packages, options, config) {
config = object.merge(config || {}, {
cwd: tempDir.path
});

return commands.install(packages, options, config);
};

var install = function(packages, options, config) {
var logger = installLogger(packages, options, config);

return helpers.expectEvent(logger, 'end');
};

