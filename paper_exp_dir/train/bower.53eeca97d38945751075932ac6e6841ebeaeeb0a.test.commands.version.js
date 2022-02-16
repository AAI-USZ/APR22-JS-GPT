var expect = require('expect.js');

var helpers = require('../helpers');
var version = helpers.require('lib/commands').version;

describe('bower list', function () {

var mainPackage = new helpers.TempDir({
'bower.json': {
name: 'foobar',
version: '0.0.0'
}
});

var gitPackage = new helpers.TempDir({
'v0.0.0': {
'bower.json': {
name: 'foobar',
version: '0.0.0'
}
}
});

it('bumps patch version', function () {
mainPackage.prepare();

return helpers.run(version, ['patch', {}, { cwd: mainPackage.path }]).then(function () {
expect(mainPackage.readJson('bower.json').version).to.be('0.0.1');
});
});

it('bumps minor version', function () {
mainPackage.prepare();

return helpers.run(version, ['minor', {}, { cwd: mainPackage.path }]).then(function () {
expect(mainPackage.readJson('bower.json').version).to.be('0.1.0');
});
});

it('bumps major version', function () {
mainPackage.prepare();

return helpers.run(version, ['major', {}, { cwd: mainPackage.path }]).then(function () {
expect(mainPackage.readJson('bower.json').version).to.be('1.0.0');
});
});

it('changes version', function () {
mainPackage.prepare();

return helpers.run(version, ['1.2.3', {}, { cwd: mainPackage.path }]).then(function () {
expect(mainPackage.readJson('bower.json').version).to.be('1.2.3');
});
});

it('returns the new version', function () {
mainPackage.prepare();

return helpers.run(version, ['major', {}, { cwd: mainPackage.path }]).then(function (results) {
