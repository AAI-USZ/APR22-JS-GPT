
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
expect(stdout).to.eq(multiline(function() { }));
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
expect(stderr).to.eq(multiline(function() { }));
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
expect(stderr).to.eq(multiline(function() { }));
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
expect(stderr).to.match(new RegExp(multiline(function() { })));
});
});

it('logs stack trace in verbose mode', function () {
return helpers.capture(function() {
var renderer = new StandardRenderer(undefined, { verbose: true });
renderer.error({
code: 'EFOOBAR',
message: 'Hello error',
details: '  Some awesome details\nMultiline!    ',
stack: [
'./one.js:1',
'./two.js:2'
]
});
}).spread(function(stdout, stderr) {
expect(stderr).to.string(multiline(function() { }));
});
});

it('logs console trace in verbose mode', function () {
return helpers.capture(function() {
var renderer = new StandardRenderer(undefined, { verbose: true });
renderer.error({
code: 'EFOOBAR',
message: 'Hello error',
details: '  Some awesome details\nMultiline!    '
});
}).spread(function(stdout, stderr) {
expect(stderr).to.match(new RegExp(multiline(function() { })));
});
});

it('outputs checkout command log', function() {
return helpers.capture(function() {
var renderer = new StandardRenderer();
renderer.log({
id: 'checkout',
origin: 'jquery#master',
message: 'foobar'
});
}).spread(function(stdout, stderr) {
expect(stdout).to.equal(multiline(function() { }));
});
});

it('outputs full progress for wide command', function() {
return helpers.capture(function() {
var renderer = new StandardRenderer('install');
renderer.log({
id: 'progress',
origin: 'jquery#master',
message: 'foobar'
});
}).spread(function(stdout, stderr) {
expect(stdout).to.equal(multiline(function() { }));
});
});

it('outputs full progress for narrow command', function() {
return helpers.capture(function() {
var renderer = new StandardRenderer('help');
renderer.log({
id: 'progress',
origin: 'jquery#master',
message: 'foobar'
});
}).spread(function(stdout, stderr) {
expect(stdout).to.equal(multiline(function() { }));
});
});

it('outputs extract log just as progress log', function() {
return helpers.capture(function() {
var renderer = new StandardRenderer('install');
renderer.log({
id: 'extract',
origin: 'jquery#master',
message: 'foobar'
});
}).spread(function(stdout, stderr) {
expect(stdout).to.equal(multiline(function() { }));
