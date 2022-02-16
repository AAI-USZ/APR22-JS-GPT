
process.stdout.columns = 130;

var expect = require('chai').expect;
var helpers = require('../helpers');
var multiline = require('multiline').stripIndent;

var StandardRenderer = helpers.require('lib/renderers/StandardRenderer');

describe('StandardRenderer', function () {

it('logs generic simple message', function () {
return helpers.capture(function() {
var renderer = new StandardRenderer();
renderer.log({
id: 'foobar',
message: 'hello world'
});
}).spread(function(stdout, stderr) {
expect(stdout).to.eq(multiline(function(){ }));
});
});

it('logs simple error', function () {
return helpers.capture(function() {
var renderer = new StandardRenderer();
renderer.error({
code: 'EFOOBAR',
message: 'Hello error'
});
}).spread(function(stdout, stderr) {
expect(stderr).to.eq(multiline(function(){ }));
});
});

it('logs error with details', function () {
return helpers.capture(function() {
var renderer = new StandardRenderer();
renderer.error({
code: 'EFOOBAR',
message: 'Hello error',
details: '  Some awesome details\nMultiline!    '
});
}).spread(function(stdout, stderr) {
expect(stderr).to.eq(multiline(function(){ }));
});
});

it('logs system details in verbose mode', function () {
return helpers.capture(function() {
var renderer = new StandardRenderer(undefined, { verbose: true });
renderer.error({
code: 'EFOOBAR',
message: 'Hello error',
details: '  Some awesome details\nMultiline!    '
});
}).spread(function(stdout, stderr) {
expect(stderr).to.match(new RegExp(multiline(function(){ })));
});
});

it('logs stack trace in verbose mode', function () {
return helpers.capture(function() {
var renderer = new StandardRenderer(undefined, { verbose: true });
renderer.error({
code: 'EFOOBAR',
message: 'Hello error',
details: '  Some awesome details\nMultiline!    ',
