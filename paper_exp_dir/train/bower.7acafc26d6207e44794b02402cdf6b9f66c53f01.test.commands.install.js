var expect = require('expect.js');
var helpers = require('../helpers');

describe('bower install', function () {

var tempDir = new helpers.TempDir();

var install = helpers.command('install', { cwd: tempDir.path });

it('correctly reads arguments', function() {
expect(install.readOptions(['jquery', 'angular', '-F', '-p', '-S', '-D', '-E']))
.to.eql([['jquery', 'angular'], {
forceLatest: true,
production: true,
save: true,
saveDev: true,
saveExact: true
}]);
});

it('correctly reads long arguments', function() {
expect(install.readOptions([
'jquery', 'angular',
'--force-latest', '--production', '--save', '--save-dev', '--save-exact'
])).to.eql([['jquery', 'angular'], {
forceLatest: true,
production: true,
save: true,
saveDev: true,
saveExact: true
}]);
});

var package = new helpers.TempDir({
'bower.json': {
name: 'package'
}
}).prepare();

var gitPackage = new helpers.TempDir();

it('writes to bower.json if --save flag is used', function () {
package.prepare();

tempDir.prepare({
'bower.json': {
name: 'test'
}
});

return helpers.run(install, [[package.path], { save: true }]).then(function() {
expect(tempDir.read('bower.json')).to.contain('dependencies');
});
});

it('writes an exact version number to dependencies in bower.json if --save --save-exact flags are used', function () {
package.prepare({
'bower.json': {
version: '1.2.3'
}
});

tempDir.prepare({
'bower.json': {
name: 'test'
}
});

return helpers.run(install, [
[package.path],
{ saveExact: true, save: true }
]).then(function() {
expect(tempDir.readJson('bower.json').dependencies.package).to.equal('1.2.3');
});
});

it('writes an exact version number to devDependencies in bower.json if --save-dev --save-exact flags are used', function () {
package.prepare({
'bower.json': {
version: '0.1.0'
}
});

tempDir.prepare({
'bower.json': {
name: 'test'
}
});

return helpers.run(install, [
[package.path],
{ saveExact: true, saveDev: true }
]).then(function() {
expect(tempDir.readJson('bower.json').devDependencies.package).to.equal('0.1.0');
});
});


it('does not write to bower.json if only --save-exact flag is used', function() {
package.prepare({
'bower.json': {
version: '1.2.3'
}
});

tempDir.prepare({
'bower.json': {
name: 'test'
}
});

return helpers.run(install, [[package.path], { saveExact: true }]).then(function() {
expect(tempDir.read('bower.json')).to.not.contain('dependencies');
expect(tempDir.read('bower.json')).to.not.contain('devDependencies');
});
});

it('reads .bowerrc from cwd', function () {
package.prepare({ foo: 'bar' });

tempDir.prepare({
'.bowerrc': { directory: 'assets' },
'bower.json': {
name: 'test',
dependencies: {
package: package.path
}
}
});

return helpers.run(install).then(function() {
expect(tempDir.read('assets/package/foo')).to.be('bar');
});
});

it.only('works if bower is run in child directory', function () {
package.prepare({ foo: 'bar' });

tempDir.prepare({
'.bowerrc': { directory: 'assets' },
'foo/bar/baz.txt': 'Hello world',
'bower.json': {
name: 'test',
dependencies: {
package: package.path
}
}
