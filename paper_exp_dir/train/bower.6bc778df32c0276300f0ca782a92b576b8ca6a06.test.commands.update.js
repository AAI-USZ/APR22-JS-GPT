var expect = require('expect.js');
var object = require('mout').object;

var helpers = require('../helpers');
var updateCmd = helpers.command('update');
var commands = helpers.require('lib/index').commands;

describe('bower update', function() {
this.timeout(10000);

var tempDir = new helpers.TempDir();

var subPackage = new helpers.TempDir({
'bower.json': {
name: 'subPackage'
}
}).prepare();

var gitPackage = new helpers.TempDir();

gitPackage.prepareGit({
'1.0.0': {
'bower.json': {
name: 'package'
},
'version.txt': '1.0.0'
},
'1.0.1': {
'bower.json': {
name: 'package',
dependencies: {
subPackage: subPackage.path
}
},
'version.txt': '1.0.1'
}
});

var mainPackage = new helpers.TempDir({
'bower.json': {
name: 'package'
}
}).prepare();

var updateLogger = function(packages, options, config) {
config = object.merge(config || {}, {
cwd: tempDir.path
});

return commands.update(packages, options, config);
};

var update = function(packages, options, config) {
var logger = updateLogger(packages, options, config);

return helpers.expectEvent(logger, 'end');
};

var install = function(packages, options, config) {
config = object.merge(config || {}, {
cwd: tempDir.path
});

var logger = commands.install(packages, options, config);

return helpers.expectEvent(logger, 'end');
};

it('correctly reads arguments', function() {
