var expect = require('expect.js');

var helpers = require('../helpers');
var version = helpers.require('lib/commands').version;

describe('bower list', function () {

var package = new helpers.TempDir({
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

it('bumps patch version', function() {
package.prepare();

return helpers.run(version, ['patch', {}, { cwd: package.path }]).then(function() {
expect(package.readJson('bower.json').version).to.be('0.0.1');
});
});

it('bumps minor version', function() {
package.prepare();

return helpers.run(version, ['minor', {}, { cwd: package.path }]).then(function() {
expect(package.readJson('bower.json').version).to.be('0.1.0');
});
});

it('bumps major version', function() {
package.prepare();

return helpers.run(version, ['major', {}, { cwd: package.path }]).then(function() {
expect(package.readJson('bower.json').version).to.be('1.0.0');
});
});

it('changes version', function() {
package.prepare();

return helpers.run(version, ['1.2.3', {}, { cwd: package.path }]).then(function() {
expect(package.readJson('bower.json').version).to.be('1.2.3');
});
});

it('returns the new version', function() {
package.prepare();

return helpers.run(version, ['major', {}, { cwd: package.path }]).then(function(results) {
expect(results[0]).to.be('1.0.0');
});
});

it('bumps patch version, create commit, and tag', function() {
return gitPackage.prepareGit().then(function() {
