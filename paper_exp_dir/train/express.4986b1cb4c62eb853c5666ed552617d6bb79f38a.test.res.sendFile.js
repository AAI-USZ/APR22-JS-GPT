
var after = require('after');
var express = require('../')
, request = require('supertest')
, assert = require('assert');
var path = require('path');
var should = require('should');
var fixtures = path.join(__dirname, 'fixtures');

describe('res', function(){
describe('.sendFile(path)', function () {
it('should error missing path', function (done) {
var app = createApp();

request(app)
.get('/')
.expect(500, /path.*required/, done);
});

it('should transfer a file', function (done) {
var app = createApp(path.resolve(fixtures, 'name.txt'));

request(app)
.get('/')
.expect(200, 'tobi', done);
});

it('should transfer a file with special characters in string', function (done) {
var app = createApp(path.resolve(fixtures, '% of dogs.txt'));

request(app)
.get('/')
.expect(200, '20%', done);
});

it('should 404 for directory', function (done) {
var app = createApp(path.resolve(fixtures, 'blog'));

request(app)
.get('/')
.expect(404, done);
});

it('should 404 when not found', function (done) {
var app = createApp(path.resolve(fixtures, 'does-no-exist'));

app.use(function (req, res) {
res.statusCode = 200;
