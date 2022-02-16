var expect = require('expect.js');

var helpers = require('../helpers');
var info = helpers.command('info');

describe('bower info', function() {
it('correctly reads arguments', function() {
expect(info.readOptions(['pkg', 'property'])).to.eql([
'pkg',
'property'
]);
});

var meta = {
name: 'package',
