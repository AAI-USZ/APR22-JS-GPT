var expect = require('expect.js');
var helpers = require('../helpers');

var init = helpers.command('init');

describe('bower init', function () {

var mainPackage = new helpers.TempDir();

it('correctly reads arguments', function () {
expect(init.readOptions([]))
.to.eql([]);
});

it('generates bower.json file', function () {
mainPackage.prepare();

var logger = init({
cwd: mainPackage.path,
interactive: true
});

return helpers.expectEvent(logger, 'prompt')
.spread(function (prompt, answer) {
answer({
name: 'test-name',
description: 'test-description',
keywords: 'test-keyword',
authors: 'test-author',
license: 'test-license',
homepage: 'test-homepage',
private: true
});

return helpers.expectEvent(logger, 'prompt');
})
.spread(function (prompt, answer) {
