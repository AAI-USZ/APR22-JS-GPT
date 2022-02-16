
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
var cb = after(1, done);
var app = express();

app.use(function (req, res) {
setImmediate(function () {
res.sendFile(path.resolve(fixtures, 'name.txt'));
cb();
});
test.abort();
});

app.use(function (err, req, res, next) {
err.code.should.be.empty()
cb();
});

var test = request(app).get('/');
test.expect(200, cb);
})

describe('with "cacheControl" option', function () {
it('should enable cacheControl by default', function (done) {
var app = createApp(path.resolve(__dirname, 'fixtures/name.txt'))

request(app)
.get('/')
.expect('Cache-Control', 'public, max-age=0')
.expect(200, done)
})

it('should accept cacheControl option', function (done) {
var app = createApp(path.resolve(__dirname, 'fixtures/name.txt'), { cacheControl: false })

request(app)
.get('/')
.expect(utils.shouldNotHaveHeader('Cache-Control'))
.expect(200, done)
})
})

describe('with "dotfiles" option', function () {
it('should not serve dotfiles by default', function (done) {
var app = createApp(path.resolve(__dirname, 'fixtures/.name'));

request(app)
.get('/')
.expect(404, done);
});

it('should accept dotfiles option', function(done){
var app = createApp(path.resolve(__dirname, 'fixtures/.name'), { dotfiles: 'allow' });

request(app)
.get('/')
.expect(200, 'tobi', done);
});
});

describe('with "headers" option', function () {
it('should accept headers option', function (done) {
var headers = {
'x-success': 'sent',
'x-other': 'done'
};
var app = createApp(path.resolve(__dirname, 'fixtures/name.txt'), { headers: headers });

request(app)
.get('/')
.expect('x-success', 'sent')
.expect('x-other', 'done')
.expect(200, done);
});

it('should ignore headers option on 404', function (done) {
var headers = { 'x-success': 'sent' };
var app = createApp(path.resolve(__dirname, 'fixtures/does-not-exist'), { headers: headers });

request(app)
.get('/')
.expect(utils.shouldNotHaveHeader('X-Success'))
.expect(404, done);
});
});

describe('with "maxAge" option', function () {
it('should set cache-control max-age from number', function (done) {
var app = createApp(path.resolve(__dirname, 'fixtures/name.txt'), {
maxAge: 14400000
})

request(app)
.get('/')
.expect('Cache-Control', 'public, max-age=14400')
.expect(200, done)
