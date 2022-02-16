var assert  = require('assert');
var path    = require('path');
var fs      = require('fs');
var nock    = require('nock');
var _       = require('lodash');
var rimraf  = require('rimraf');
var async   = require('async');
var config  = require('../lib/core/config');
var Package = require('../lib/core/package');

describe('package', function () {

beforeEach(function (done) {
var del = 0;

rimraf(config.directory, function (err) {

if (++del >= 2) done();
});

rimraf(config.cache, function (err) {

if (++del >= 2) done();
});
});

it('Should resolve git URLs properly', function () {
var pkg = new Package('jquery', 'git://github.com/jquery/jquery.git');
assert.equal(pkg.gitUrl, 'git://github.com/jquery/jquery.git');
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

it('Should resolve url when we got redirected', function (next) {
var redirecting_url    = 'http://redirecting-url.com';
var redirecting_to_url = 'http://redirected-to-url.com';

var redirect_scope = nock(redirecting_url)
.defaultReplyHeaders({'location': redirecting_to_url + '/jquery.zip'})
.get('/jquery.zip')
.reply(302);

var redirect_to_scope = nock(redirecting_to_url)
.get('/jquery.zip')
.reply(200, "jquery content");

var pkg = new Package('jquery', redirecting_url + '/jquery.zip');

pkg.on('resolve', function () {
assert(pkg.assetUrl);
assert.equal(pkg.assetUrl, redirecting_to_url + '/jquery.zip');
next();
});

pkg.on('error', function (err) {
throw new Error(err);
});

pkg.download();
});
