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

var packageWithoutTags = new helpers.TempDir({});


