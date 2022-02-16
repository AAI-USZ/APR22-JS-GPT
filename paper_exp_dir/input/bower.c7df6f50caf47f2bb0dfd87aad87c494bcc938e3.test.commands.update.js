var expect = require('expect.js');
var object = require('mout').object;

var helpers = require('../helpers');
var updateCmd = helpers.command('update');
var commands = helpers.require('lib/index').commands;

describe('bower update', function () {

var tempDir = new helpers.TempDir();

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
name: 'package'
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

it('runs preinstall hook when installing missing package', function () {
package.prepare();

tempDir.prepare({
'bower.json': {
name: 'test',
dependencies: {
package: package.path
}
},
'.bowerrc': {
scripts: {
}
}
});

return update().then(function() {
expect(tempDir.read('preinstall.txt')).to.be('package');
});
});

it('runs postinstall hook when installing missing package', function () {
package.prepare();

tempDir.prepare({
'bower.json': {
name: 'test',
dependencies: {
package: package.path
}
},
'.bowerrc': {
scripts: {
}
}
});

return update().then(function() {
expect(tempDir.read('postinstall.txt')).to.be('package');
});
});

it('doesn\'t runs postinstall when no package is update', function () {
package.prepare();

tempDir.prepare({
'bower.json': {
name: 'test',
dependencies: {
package: package.path
}
},
'.bowerrc': {
scripts: {
