var expect = require('expect.js');
var helpers = require('../helpers');
var help = helpers.command('help');

describe('bower help', function() {
it('correctly reads arguments', function() {
expect(help.readOptions(['foo'])).to.eql(['foo']);
});

it('shows general help', function() {
return helpers.run(help).spread(function(result) {
expect(result.usage[0]).to.be.a('string');
expect(result.commands).to.be.a('object');
expect(result.options).to.be.a('object');
