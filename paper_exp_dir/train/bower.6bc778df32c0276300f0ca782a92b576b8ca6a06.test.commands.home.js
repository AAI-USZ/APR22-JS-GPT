var Q = require('q');
var expect = require('expect.js');
var helpers = require('../helpers');

var home = helpers.command('home');

describe('bower home', function() {
it('correctly reads arguments', function() {
expect(home.readOptions(['foo'])).to.eql(['foo']);
});

var mainPackage = new helpers.TempDir({
'bower.json': {
name: 'package',
homepage: 'http://bower.io'
}
