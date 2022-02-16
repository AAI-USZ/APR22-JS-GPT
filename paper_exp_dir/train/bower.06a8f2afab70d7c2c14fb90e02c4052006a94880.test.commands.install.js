var path = require('path');
var expect = require('expect.js');
var fs = require('fs');

var helpers = require('../helpers');
var commands = helpers.require('lib/index').commands;

describe('bower install', function () {

var tempDir = new helpers.TempDir();


function bowerJson() {
var bowerJsonPath = path.join(
tempDir.path, 'bower_components', 'underscore', 'bower.json'
);

return JSON.parse(fs.readFileSync(bowerJsonPath));
}

