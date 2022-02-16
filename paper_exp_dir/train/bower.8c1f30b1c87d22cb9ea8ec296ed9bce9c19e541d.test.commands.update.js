var expect = require('expect.js');
var object = require('mout').object;
var semver = require('semver');

var helpers = require('../helpers');
var rimraf = require('../../lib/util/rimraf');
var updateCmd = helpers.command('update');
var commands = helpers.require('lib/index').commands;

describe('bower update', function() {

var tempDir = new helpers.TempDir();

var subPackage = new helpers.TempDir({
'bower.json': {
name: 'subPackage'
}
}).prepare();

var gitPackage = new helpers.TempDir();
var gitPackage2 = new helpers.TempDir();
var gitPackage3 = new helpers.TempDir();

gitPackage.prepareGit({
'0.1.1': {
'bower.json': {
name: 'package'
},
'version.txt': '0.9.0'
},
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

gitPackage2.prepareGit({
'2.0.0': {
'bower.json': {
name: 'package'
},
'version.txt': '2.0.0'
},
'2.0.1': {
'bower.json': {
name: 'package'
},
'version.txt': '2.0.1'
}
});

gitPackage3.prepareGit({
'3.0.0': {
'bower.json': {
name: 'package'
},
'version.txt': '3.0.0'
},
'3.0.1': {
'bower.json': {
name: 'package'
},
'version.txt': '3.0.1'
}
});

var mainPackage = new helpers.TempDir({
'bower.json': {
name: 'package'
}
}).prepare();

var update = function(packages, options, config) {
config = object.merge(config || {}, {
cwd: tempDir.path
});

var logger = commands.update(
packages, options, config
);

return helpers.expectEvent(logger, 'end');
};

var install = function(packages, options, config) {
config = object.merge(config || {}, {
cwd: tempDir.path
});

var logger = commands.install(
packages, options, config
);

return helpers.expectEvent(logger, 'end');
};

it('correctly reads arguments', function() {
expect(updateCmd.readOptions(['jquery', '-F', '-p', '-S', '-D']))
.to.eql([
['jquery'], {
forceLatest: true,
production: true,
save: true,
saveDev: true
}
]);
});
