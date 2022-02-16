

var assert  = require('assert');
var fs      = require('fs');
var path    = require('path');
var nock    = require('nock');
var _       = require('lodash');
var rimraf  = require('rimraf');
var glob    = require('glob');
var async   = require('async');
var config  = require('../lib/core/config');
var Package = require('../lib/core/package');

describe('package', function () {
var savedConfigJson = config.json;

function clean(done) {
var del = 0;


config.json = savedConfigJson;

rimraf(config.directory, function () {

if (++del >= 2) done();
});

rimraf(config.cache, function () {

if (++del >= 2) done();
});
}

beforeEach(clean);
after(clean);

it('Should resolve git URLs properly', function () {
var pkg = new Package('jquery', 'git://github.com/jquery/jquery.git');
assert.equal(pkg.gitUrl, 'git://github.com/jquery/jquery.git');
});

it('Should resolve git shorthands (username/project)', function () {
var pkg = new Package('jquery', 'jquery/jquery');
assert.equal(pkg.gitUrl, 'git://github.com/jquery/jquery.git');
});

it('Should resolve git shorthands (username/project) with specific tag', function () {
var pkg = new Package('jquery', 'jquery/jquery#1.0.0');
assert.equal(pkg.gitUrl, 'git://github.com/jquery/jquery.git');
assert.equal(pkg.tag, '1.0.0');
});

it('Should resolve git HTTP URLs properly', function () {
var pkg = new Package('jquery', 'git+http://example.com/project.git');
assert.equal(pkg.gitUrl, 'http://example.com/project.git');
});

it('Should resolve git HTTPS URLs properly', function () {
var pkg = new Package('jquery', 'git+https://example.com/project.git');
assert.equal(pkg.gitUrl, 'https://example.com/project.git');
});

it('Should resolve git URL tags', function () {
var pkg = new Package('jquery', 'git://github.com/jquery/jquery.git#v1.0.1');
assert.equal(pkg.tag, 'v1.0.1');
});

it('Should resolve github urls', function () {
var pkg = new Package('jquery', 'git@github.com:twitter/flight.git#v1.0.1');
assert.equal(pkg.tag, 'v1.0.1');
assert.equal(pkg.gitUrl, 'git@github.com:twitter/flight.git');
});

it('Should resolve normal HTTP URLs', function (next) {
var pkg = new Package('bootstrap', 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js');

pkg.on('resolve', function () {
assert(pkg.assetUrl);
assert.equal(pkg.assetUrl, 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js');
next();
});

pkg.on('error', function (err) {
throw err;
});

pkg.resolve();
});

it('Should resolve url when we got redirected', function (next) {
after(function () {
nock.cleanAll();
});

var redirecting_url    = 'http://redirecting-url.com';
var redirecting_to_url = 'http://redirected-to-url.com';

nock(redirecting_url)
.defaultReplyHeaders({'location': redirecting_to_url + '/jquery.js'})
.get('/jquery.js')
.reply(302);

nock(redirecting_to_url)
.get('/jquery.js')
.reply(200, 'jquery content');

var pkg = new Package('jquery', redirecting_url + '/jquery.js');

pkg.on('resolve', function () {
assert(pkg.assetUrl);
assert.equal(pkg.assetUrl, redirecting_to_url + '/jquery.js');
next();
});

pkg.on('error', function (err) {
throw err;
});

pkg.resolve();
});

it('Should error if the HTTP status is not OK', function (next) {
var pkg = new Package('test', 'http://somedomainthatwillneverexistbower.com/test.js');

pkg.on('resolve', function () {
throw new Error('Should have given an error');
});

pkg.on('error', function () {
next();
});

pkg.resolve();
});

it('Should clone git packages', function (next) {
var pkg = new Package('jquery', 'git://github.com/maccman/package-jquery.git');

pkg.on('resolve', function () {
assert(pkg.path);
assert(fs.existsSync(pkg.path));
next();
});

pkg.on('error', function (err) {
throw err;
});

pkg.resolve();
});


it('Should error on clone fail', function (next) {
var pkg = new Package('random', 'git://example.com');

pkg.on('error', function (err) {
assert(err);
next();
});

pkg.resolve();
});

it('Should copy path packages', function (next) {
var pkg = new Package('jquery', __dirname + '/assets/package-jquery');

pkg.on('resolve', function () {
assert(pkg.path);
assert(fs.existsSync(pkg.path));
next();
});

pkg.on('error', function (err) {
throw err;
});

pkg.resolve();
});

it('Should load configured json file package-wise', function (next) {
var pkg = new Package('mypackage', __dirname + '/assets/package-nonstandard-json');

pkg.on('loadJSON', function () {
assert(pkg.json);
assert.equal(pkg.json.name, 'mypackage');
assert.equal(pkg.json.version, '1.0.0');
next();
});

pkg.on('error', function (err) {
throw err;
});

pkg.loadJSON();
});

it('Should load configured json file project-wise if not defined package-wise', function (next) {
config.json = 'foocomponent.json';
var pkg = new Package('mypackage', __dirname + '/assets/package-nonstandard-json-copy');

pkg.on('loadJSON', function () {
assert(pkg.json);
assert.equal(pkg.json.name, 'mypackage');
assert.equal(pkg.json.version, '1.0.0');


pkg = new Package('mypackage', __dirname + '/assets/package-empty-rc');

pkg.on('loadJSON', function () {
assert(pkg.json);
assert.equal(pkg.json.name, 'mypackage-foo');
assert.equal(pkg.json.version, '1.0.0');

next();
});

pkg.on('error', function (err) {
throw err;
});

pkg.loadJSON();
});

pkg.on('error', function (err) {
throw err;
});

pkg.loadJSON();
});

it('Should fallback to component.json if the json project-wise does not exist', function (next) {
config.json = 'foocomponent.json';
var pkg = new Package('jquery', __dirname + '/assets/package-jquery');

pkg.on('loadJSON', function () {
assert(pkg.json);
assert.equal(pkg.json.name, 'jquery');
assert.equal(pkg.json.version, '1.8.1');
next();
});

pkg.on('error', function (err) {
throw err;
});

pkg.loadJSON();
});

it('Should fallback to component.json if not defined project wise and package-wise', function (next) {
var pkg = new Package('jquery', __dirname + '/assets/package-jquery');

pkg.on('loadJSON', function () {
assert(pkg.json);
assert.equal(pkg.json.name, 'jquery');
assert.equal(pkg.json.version, '1.8.1');


pkg = new Package('jquery', __dirname + '/assets/package-empty-rc');

pkg.on('loadJSON', function () {
assert(pkg.json);
assert.equal(pkg.json.name, 'mypackage');
assert.equal(pkg.json.version, '1.0.0');


next();
});

pkg.on('error', function (err) {
throw err;
});

pkg.loadJSON();
});

pkg.on('error', function (err) {
throw err;
});

pkg.loadJSON();
});

it('Should correct guessed name with configured json file package-wise', function (next) {
var pkg = new Package(null, __dirname + '/assets/package-jquery');

pkg.on('loadJSON', function () {
assert(pkg.json);
assert.equal(pkg.name, 'jquery');
assert.equal(pkg.json.name, 'jquery');
assert.equal(pkg.json.version, '1.8.1');
next();
});

pkg.on('error', function (err) {
throw err;
