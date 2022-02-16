

var assert  = require('assert');
var fs      = require('fs');
var nock    = require('nock');
var _       = require('lodash');
var rimraf  = require('rimraf');
var async   = require('async');
var config  = require('../lib/core/config');
var Package = require('../lib/core/package');

describe('package', function () {

function clean(done) {
var del = 0;

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
