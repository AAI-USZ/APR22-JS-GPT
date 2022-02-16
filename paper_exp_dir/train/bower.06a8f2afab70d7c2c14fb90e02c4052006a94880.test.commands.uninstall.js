var path = require('path');
var expect = require('expect.js');
var fs = require('fs');

var helpers = require('../helpers');
var bower = helpers.require('lib/index');

describe('bower uninstall', function () {

var tempDir = new helpers.TempDir({
'bower.json': {
name: 'hello-world',
dependencies: {
'underscore': '*'
}
}
});

beforeEach(function() {
tempDir.prepare();
});

var bowerJsonPath = path.join(tempDir.path, 'bower.json');

function bowerJson() {
return JSON.parse(fs.readFileSync(bowerJsonPath));
}

