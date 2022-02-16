var expect = require('expect.js');
var path = require('path');
var helpers = require('../helpers');
var nock = require('nock');
var rimraf = require('rimraf');
var fs = require('../../lib/util/fs');
var tar = require('tar-fs');
var destroy = require('destroy');
var Q = require('q');

describe('bower install', function () {

var tempDir = new helpers.TempDir();

var install = helpers.command('install', {
cwd: tempDir.path
});

it('correctly reads arguments', function () {
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

it('correctly reads long arguments', function () {
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

it('writes to bower.json if --save flag is used', function () {
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
]).then(function () {
expect(tempDir.read('bower.json')).to.contain('dependencies');
});
});

it('does not write to bower.json if no --save flag is used', function () {
mainPackage.prepare();

tempDir.prepare({
'bower.json': {
name: 'test'
}
});

return helpers.run(install, [
[mainPackage.path], {
}
]).then(function () {
expect(tempDir.read('bower.json')).to.not.contain('dependencies');
});
});

it('writes to bower.json if save config setting is set to true', function () {
mainPackage.prepare();

