
var after = require('after');
var express = require('../')
, request = require('supertest')
, assert = require('assert');
var onFinished = require('on-finished');
var path = require('path');
var should = require('should');
var fixtures = path.join(__dirname, 'fixtures');
var utils = require('./support/utils');

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

it('should include ETag', function (done) {
var app = createApp(path.resolve(fixtures, 'name.txt'));

request(app)
.get('/')
.expect('ETag', /^(?:W\/)?"[^"]+"$/)
.expect(200, 'tobi', done);
});

it('should 304 when ETag matches', function (done) {
var app = createApp(path.resolve(fixtures, 'name.txt'));

request(app)
.get('/')
.expect('ETag', /^(?:W\/)?"[^"]+"$/)
.expect(200, 'tobi', function (err, res) {
if (err) return done(err);
var etag = res.headers.etag;
request(app)
.get('/')
.set('If-None-Match', etag)
.expect(304, done);
});
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
res.send('no!');
});

request(app)
.get('/')
.expect(404, done);
});

it('should not override manual content-types', function (done) {
var app = express();

app.use(function (req, res) {
res.contentType('application/x-bogus');
res.sendFile(path.resolve(fixtures, 'name.txt'));
});

request(app)
.get('/')
.expect('Content-Type', 'application/x-bogus')
.end(done);
})

it('should not error if the client aborts', function (done) {
var app = express();
var cb = after(2, done)
var error = null

app.use(function (req, res) {
setImmediate(function () {
res.sendFile(path.resolve(fixtures, 'name.txt'));
server.close(cb)
setTimeout(function () {
cb(error)
