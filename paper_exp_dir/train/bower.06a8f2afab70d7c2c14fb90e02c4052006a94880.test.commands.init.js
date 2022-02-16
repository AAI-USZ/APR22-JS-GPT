var path = require('path');
var expect = require('expect.js');
var fs = require('fs');

var helpers = require('../helpers');
var bower = helpers.require('lib/index');

describe('bower init', function () {

var tempDir = new helpers.TempDir();
var bowerJsonPath = path.join(tempDir.path, 'bower.json');

var config = {
cwd: tempDir.path,
interactive: true
};

it('generates bower.json file', function () {
tempDir.prepare();

var logger = bower.commands.init(config);

return helpers.expectEvent(logger, 'prompt')
.spread(function (prompt, answer) {
answer({
name: 'test-name',
