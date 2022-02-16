var expect = require('expect.js');
var path = require('path');
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
production: true,
save: true,
saveDev: true,
saveExact: true
}
]);
});

it('correctly reads long arguments', function() {
expect(install.readOptions([
'jquery', 'angular',
'--force-latest', '--production', '--save', '--save-dev', '--save-exact'
])).to.eql([
['jquery', 'angular'], {
forceLatest: true,
production: true,
save: true,
saveDev: true,
saveExact: true
}
]);
});

var mainPackage = new helpers.TempDir({
'bower.json': {
name: 'package'
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
name: 'package'
},
'version.txt': '1.0.1'
}
});

it('writes to bower.json if --save flag is used', function() {
mainPackage.prepare();

tempDir.prepare({
'bower.json': {
name: 'test'
}
});

return helpers.run(install, [
[mainPackage.path], {
save: true
}
]).then(function() {
expect(tempDir.read('bower.json')).to.contain('dependencies');
});
});

it('writes an exact version number to dependencies in bower.json if --save --save-exact flags are used', function() {
mainPackage.prepare({
'bower.json': {
name: 'package',
version: '1.2.3'
}
});

tempDir.prepare({
'bower.json': {
name: 'test'
}
});

return helpers.run(install, [
[mainPackage.path], {
saveExact: true,
save: true
}
]).then(function() {
expect(tempDir.readJson('bower.json').dependencies.package).to.equal(mainPackage.path + '#1.2.3');
});
});

it('writes an exact version number to devDependencies in bower.json if --save-dev --save-exact flags are used', function() {
mainPackage.prepare({
'bower.json': {
name: 'package',
version: '0.1.0'
}
});

tempDir.prepare({
'bower.json': {
name: 'test'
}
});

return helpers.run(install, [
[mainPackage.path], {
saveExact: true,
saveDev: true
}
]).then(function() {
expect(tempDir.readJson('bower.json').devDependencies.package).to.equal(mainPackage.path + '#0.1.0');
});
});

it('reads .bowerrc from cwd', function() {
mainPackage.prepare({
foo: 'bar'
});

tempDir.prepare({
'.bowerrc': {
directory: 'assets'
},
'bower.json': {
name: 'test',
dependencies: {
package: mainPackage.path
}
}
});

return helpers.run(install).then(function() {
expect(tempDir.read('assets/package/foo')).to.be('bar');
});
});

it('runs preinstall hook', function() {
mainPackage.prepare();

tempDir.prepare({
'bower.json': {
name: 'test',
dependencies: {
package: mainPackage.path
}
},
'.bowerrc': {
scripts: {
preinstall: 'node -e \'require("fs").writeFileSync("preinstall.txt", "%")\''
}
}
});

return helpers.run(install).then(function() {
expect(tempDir.read('preinstall.txt')).to.be('package');
});
});

it('runs postinstall hook', function() {
mainPackage.prepare();

tempDir.prepare({
'bower.json': {
name: 'test',
dependencies: {
package: mainPackage.path
}
},
'.bowerrc': {
scripts: {
postinstall: 'node -e \'require("fs").writeFileSync("postinstall.txt", "%")\''
}
}
});

return helpers.run(install).then(function() {
expect(tempDir.read('postinstall.txt')).to.be('package');
});
});


it('does not run hooks if nothing is installed', function() {
tempDir.prepare({
'bower.json': {
name: 'test'
},
'.bowerrc': {
scripts: {
postinstall: 'node -e \'require("fs").writeFileSync("hooks.txt", "%")\'',
preinstall: 'node -e \'require("fs").writeFileSync("hooks.txt", "%")\''
}
}
});

return helpers.run(install).then(function() {
expect(tempDir.exists('hooks.txt')).to.be(false);
});
});

it('runs postinstall after bower.json is written', function() {
mainPackage.prepare();

tempDir.prepare({
'bower.json': {
name: 'test'
},
'.bowerrc': {
scripts: {
postinstall: 'node -e \'var fs = require("fs"); fs.writeFileSync("hook.txt", fs.readFileSync("bower.json"));\''
}
}
});

return helpers.run(install, [
[mainPackage.path], {
save: true
}
]).then(function() {
expect(tempDir.read('hook.txt')).to.contain('dependencies');
});
});

it('display the output of hook scripts', function(next) {
mainPackage.prepare();

tempDir.prepare({
'bower.json': {
name: 'test',
dependencies: {
package: mainPackage.path
}
},
'.bowerrc': {
scripts: {
postinstall: 'node -e \'process.stdout.write("foobar")\''
}
}
});
var lastAction = null;

helpers.run(install).logger.intercept(function(log) {
if (log.level === 'action') {
lastAction = log;
}
}).on('end', function() {
expect(lastAction.message).to.be('foobar');
next();
});
});

it('skips components not installed by bower', function() {
mainPackage.prepare({
'.git': {}
});

tempDir.prepare({
'bower.json': {
name: 'test',
dependencies: {
package: mainPackage.path
}
}
});

return helpers.run(install).then(function() {
var packageFiles = fs.readdirSync(mainPackage.path);

expect(packageFiles).to.contain('.git');
});
});

