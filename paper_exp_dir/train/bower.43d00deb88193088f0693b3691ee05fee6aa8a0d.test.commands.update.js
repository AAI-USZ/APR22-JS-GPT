var expect = require('expect.js');
var object = require('mout').object;

var helpers = require('../helpers');
var updateCmd = helpers.command('update');
var commands = helpers.require('lib/index').commands;

describe('bower update', function () {

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

var package = new helpers.TempDir({
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

var logger = commands.install(
packages, options, config
);

return helpers.expectEvent(logger, 'end');
};

it('correctly reads arguments', function() {
expect(updateCmd.readOptions(['jquery', '-F', '-p']))
.to.eql([['jquery'], { forceLatest: true, production: true }]);
});

it('install missing packages', function () {
package.prepare();

tempDir.prepare({
'bower.json': {
name: 'test',
dependencies: {
package: package.path
}
}
});

return update().then(function() {
expect(tempDir.exists('bower_components/package/bower.json')).to.equal(true);
expect(tempDir.read('bower_components/package/bower.json')).to.contain('"name": "package"');
});
});

it('does not install ignored dependencies', function() {
var package3 = new helpers.TempDir({
'bower.json': {
name: 'package3'
}
}).prepare();

var package2 = new helpers.TempDir({
'bower.json': {
name: 'package2',
dependencies: {
package3: package3.path
}
}
}).prepare();

tempDir.prepare({
'bower.json': {
name: 'test',
dependencies: {
package2: package2.path
}
},
'.bowerrc': {
ignoredDependencies: ['package3']
}
});

return update().then(function() {
expect(tempDir.exists('bower_components/package2/bower.json')).to.equal(true);
expect(tempDir.exists('bower_components/package3')).to.equal(false);
});

});

it('does not install ignored dependencies if run multiple times', function() {
var package3 = new helpers.TempDir({
'bower.json': {
name: 'package3'
}
}).prepare();

var package2 = new helpers.TempDir({
'bower.json': {
name: 'package2',
