
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
});
});

it('outputs incompatible log with suitable package', function() {
return helpers.capture(function() {
var renderer = new StandardRenderer();
renderer.log({
id: 'incompatible',
data: {
resolution: '~0.1.1',
suitable: {
pkgMeta: {
_release: '0.1.2'
},
endpoint: {
name: 'foobar'
}
},
picks: [
{
pkgMeta: {
_release: '0.0.0'
},
endpoint: {
name: 'fizfuz',
target: '~0.0.0'
},
dependants: [
{
pkgMeta: {
_release: 'release1'
},
endpoint: {
name: 'dependant1'
}
},
{
pkgMeta: {
_release: 'release2'
},
endpoint: {
name: 'dependant2'
}
}
]
},
{
endpoint: {
name: 'fizfuz2'
},
dependants: [
{
pkgMeta: {

},
endpoint: {
name: 'jquery2'
}
}
]
}
]
}
});
}).spread(function(stdout, stderr) {
expect(stdout).to.equal(multiline(function() { }));
});
});

it('outputs solver log without suitable package', function() {
return helpers.capture(function() {
var renderer = new StandardRenderer();
renderer.log({
id: 'solved',
data: {
resolution: '~0.1.1',
picks: [
{
pkgMeta: {
_release: '0.0.0'
},
endpoint: {
name: 'fizfuz',
target: '~0.0.0'
},
dependants: [
{
pkgMeta: {
_release: 'release1'
},
endpoint: {
name: 'dependant1'
}
},
{
pkgMeta: {
_release: 'release2'
},
endpoint: {
name: 'dependant2'
}
}
]
},
{
endpoint: {
name: 'fizfuz2'
},
dependants: [
{
pkgMeta: {

},
endpoint: {
name: 'jquery2'
}
}
]
}
]
}
});
}).spread(function(stdout, stderr) {
expect(stdout).to.equal(multiline(function() { }));
});
});

it('outputs json log', function() {
return helpers.capture(function() {
var renderer = new StandardRenderer();
renderer.log({
id: 'json',
data: {
json: {
foo: 'bar',
fiz: {
fuz: 'faz'
}
}
}
});
}).spread(function(stdout, stderr) {
expect(stdout).to.equal(multiline(function() { }));
});
});

it('outputs cached entry log', function() {
return helpers.capture(function() {
var renderer = new StandardRenderer('install');
renderer.log({
id: 'cached-entry',
origin: 'origin',
message: 'message'
});
}).spread(function(stdout, stderr) {
expect(stdout).to.equal(multiline(function() { }));
});
});

it('adjusts whitespace when package id too long', function() {
return helpers.capture(function() {
var renderer = new StandardRenderer('install', {});
renderer.log({
id: 'generic',
origin: 'short-origin',
message: 'message'
});

renderer.log({
id: 'generic',
origin: 'very-very-long-origin-string',
message: 'message'
});

renderer.log({
id: 'generic',
origin: 'short-origin',
message: 'message'
});
}).spread(function(stdout, stderr) {
expect(stdout).to.equal(multiline(function() { }));
});
});

it('outputs install command log', function() {
return helpers.capture(function() {
var renderer = new StandardRenderer('install', {
cwd: '/tmp'
});

renderer.end([
{
canonicalDir: '/tmp/components/jquery',
pkgMeta: {
_release: '0.1.2'
},
endpoint: {
name: 'jquery'
}
},
{
canonicalDir: '/tmp/components/jquery',
pkgMeta: {
version: '0.1.2'
},
endpoint: {
name: 'jquery'
}
},
{
canonicalDir: '/tmp/components/jquery',
pkgMeta: {
_release: '0.1.2'
},
endpoint: {
name: 'jquery'
},
missing: true
},
{
canonicalDir: '/tmp/components/jquery',
pkgMeta: {
_release: '0.1.2'
},
endpoint: {
name: 'jquery'
},
different: true
},
{
canonicalDir: '/tmp/components/jquery',
pkgMeta: {
_release: '0.1.2'
},
endpoint: {
name: 'jquery'
},
linked: true
},
{
canonicalDir: '/tmp/components/jquery',
pkgMeta: {
_release: '0.1.2'
},
endpoint: {
name: 'jquery',
target: '~0.1.2'
},
incompatible: true
},
{
canonicalDir: '/tmp/components/jquery',
pkgMeta: {
_release: '0.1.2'
},
endpoint: {
name: 'jquery',
target: '~0.1.2'
},
extraneous: true
},
{
canonicalDir: '/tmp/components/jquery',
pkgMeta: {
_release: '0.1.2'
},
endpoint: {
name: 'jquery',
target: '~0.1.2'
},
update: {
target: '0.1.5',
latest: '0.2.0'
}
},
{
canonicalDir: '/tmp/components/jquery',
pkgMeta: {
_release: '0.1.2'
},
endpoint: {
name: 'jquery'
},
dependencies: {
angular: {
canonicalDir: '/tmp/components/angular',
pkgMeta: {
_release: '0.1.3'
},
endpoint: {
name: 'angular'
}
},
ember: {
canonicalDir: '/tmp/components/ember',
pkgMeta: {
_release: '0.2.3'
},
endpoint: {
name: 'ember'
},
dependencies: {

react: {
canonicalDir: '/tmp/components/react',
pkgMeta: {
_release: '0.2.3'
},
endpoint: {
name: 'react'
}
}
}
}
}
}
]);
}).spread(function(stdout, stderr) {
if (helpers.isWin()) {
expect(stdout).to.equal(multiline(function() { }));
} else {
expect(stdout).to.equal(multiline(function() { }));
}
});
});

it('outputs short info command log', function() {
return helpers.capture(function() {
var renderer = new StandardRenderer('info', {});
renderer.end({
version: '1.2.3'
});
}).spread(function(stdout, stderr) {
expect(stdout).to.equal(multiline(function() { }));
});
});

it('outputs full info command log', function() {
return helpers.capture(function() {
var renderer = new StandardRenderer('info', {});
renderer.end({
name: 'foo',
latest: {
version: '1.2.3'
},
versions: [
'1.2.0',
'1.2.1',
'1.2.2',
'1.2.3+build-1234',
'1.2.8-build.2098+sha.cb9c0f2',
'1.3.0-rc.5',
'1.3.0-beta.18'
]
});
}).spread(function(stdout, stderr) {
expect(stdout).to.equal(multiline(function() { }));
});
});
