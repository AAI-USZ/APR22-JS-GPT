
process.stdout.columns = 130;

var expect = require('chai').expect;
var helpers = require('../helpers');
var multiline = require('multiline').stripIndent;

var StandardRenderer = helpers.require('lib/renderers/StandardRenderer');

describe('StandardRenderer', function() {
it('logs generic simple message', function() {
return helpers
.capture(function() {
var renderer = new StandardRenderer();
renderer.log({
id: 'foobar',
message: 'hello world'
});
})
.spread(function(stdout, stderr) {
expect(stdout).to.eq(
multiline(function() {

})
);
