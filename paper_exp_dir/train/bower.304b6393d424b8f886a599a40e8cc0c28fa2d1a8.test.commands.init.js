var expect = require('expect.js');
var helpers = require('../helpers');

var init = helpers.command('init');

describe('bower init', function () {

var package = new helpers.TempDir();

it('correctly reads arguments', function() {
expect(init.readOptions([]))
.to.eql([]);
});

it('generates bower.json file', function () {
package.prepare();

var logger = init({
cwd: package.path,
interactive: true
});

return helpers.expectEvent(logger, 'prompt')
.spread(function (prompt, answer) {
answer({
name: 'test-name',
version: 'test-version',
description: 'test-description',
moduleType: 'test-moduleType',
keywords: 'test-keyword',
authors: 'test-author',
license: 'test-license',
homepage: 'test-homepage',
private: true
});

return helpers.expectEvent(logger, 'prompt');
})
.spread(function (prompt, answer) {
answer({ prompt: true });
return helpers.expectEvent(logger, 'end');
})
.then(function () {
expect(package.readJson('bower.json')).to.eql({
name: 'test-name',
version: 'test-version',
homepage: 'test-homepage',
authors: [ 'test-author' ],
description: 'test-description',
moduleType: 'test-moduleType',
keywords: [ 'test-keyword' ],
license: 'test-license',
private: true
});
});
});

it('errors on non-interactive mode', function () {
package.prepare();

return helpers.run(init, { cwd: package.path }).then(
function () { throw 'should fail'; },
function (reason) {
