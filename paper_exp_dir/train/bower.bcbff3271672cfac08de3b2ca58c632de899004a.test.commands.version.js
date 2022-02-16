var expect = require('expect.js');

var helpers = require('../helpers');
var version = helpers.require('lib/commands').version;

describe('bower version', function () {

var mainPackage = new helpers.TempDir({
'v0.0.0': {
'bower.json': {
name: 'foobar',
}
}
});

it('bumps patch version', function () {
mainPackage.prepareGit();

return helpers.run(version, ['patch', {}, { cwd: mainPackage.path }]).then(function () {
expect(mainPackage.latestGitTag()).to.be('0.0.1');
});
});

it('bumps minor version', function () {
mainPackage.prepareGit();

return helpers.run(version, ['minor', {}, { cwd: mainPackage.path }]).then(function () {
