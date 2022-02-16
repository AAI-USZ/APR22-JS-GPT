
var assert = require('assert')
var Buffer = require('safe-buffer').Buffer
var express = require('..');
var methods = require('methods');
var request = require('supertest');
var utils = require('./support/utils');

describe('res', function(){
describe('.send()', function(){
it('should set body to ""', function(done){
var app = express();

app.use(function(req, res){
res.send();
});

request(app)
.get('/')
.expect(200, '', done);
})
})

describe('.send(null)', function(){
it('should set body to ""', function(done){
var app = express();

app.use(function(req, res){
res.send(null);
});

request(app)
.get('/')
.expect('Content-Length', '0')
.expect(200, '', done);
})
})

describe('.send(undefined)', function(){
it('should set body to ""', function(done){
var app = express();

app.use(function(req, res){
res.send(undefined);
});

request(app)
.get('/')
.expect(200, '', done);
})
})

describe('.send(code)', function(){
it('should set .statusCode', function(done){
var app = express();

app.use(function(req, res){
res.send(201)
});

request(app)
.get('/')
.expect('Created')
.expect(201, done);
})
})

describe('.send(code, body)', function(){
it('should set .statusCode and body', function(done){
var app = express();

app.use(function(req, res){
res.send(201, 'Created :)');
});

request(app)
.get('/')
.expect('Created :)')
.expect(201, done);
})
})

describe('.send(body, code)', function(){
it('should be supported for backwards compat', function(done){
var app = express();

app.use(function(req, res){
res.send('Bad!', 400);
});

request(app)
.get('/')
.expect('Bad!')
.expect(400, done);
})
})

describe('.send(code, number)', function(){
it('should send number as json', function(done){
var app = express();

app.use(function(req, res){
res.send(200, 0.123);
});

request(app)
.get('/')
.expect('Content-Type', 'application/json; charset=utf-8')
.expect(200, '0.123', done);
})
})

describe('.send(String)', function(){
it('should send as html', function(done){
var app = express();

app.use(function(req, res){
res.send('<p>hey</p>');
});

request(app)
.get('/')
.expect('Content-Type', 'text/html; charset=utf-8')
.expect(200, '<p>hey</p>', done);
})

it('should set ETag', function (done) {
var app = express();

app.use(function (req, res) {
var str = Array(1000).join('-');
res.send(str);
});

request(app)
.get('/')
.expect('ETag', 'W/"3e7-qPnkJ3CVdVhFJQvUBfF10TmVA7g"')
.expect(200, done);
})

it('should not override Content-Type', function(done){
var app = express();

app.use(function(req, res){
res.set('Content-Type', 'text/plain').send('hey');
});

request(app)
.get('/')
.expect('Content-Type', 'text/plain; charset=utf-8')
.expect(200, 'hey', done);
})

it('should override charset in Content-Type', function(done){
var app = express();

app.use(function(req, res){
res.set('Content-Type', 'text/plain; charset=iso-8859-1').send('hey');
});

request(app)
.get('/')
.expect('Content-Type', 'text/plain; charset=utf-8')
.expect(200, 'hey', done);
})

it('should keep charset in Content-Type for Buffers', function(done){
var app = express();

app.use(function(req, res){
res.set('Content-Type', 'text/plain; charset=iso-8859-1').send(Buffer.from('hi'))
});

request(app)
.get('/')
.expect('Content-Type', 'text/plain; charset=iso-8859-1')
.expect(200, 'hi', done);
})
})

describe('.send(Buffer)', function(){
it('should send as octet-stream', function(done){
var app = express();

app.use(function(req, res){
res.send(Buffer.from('hello'))
});

request(app)
.get('/')
.expect(200)
.expect('Content-Type', 'application/octet-stream')
.expect(shouldHaveBody(Buffer.from('hello')))
.end(done)
})

it('should set ETag', function (done) {
var app = express();

app.use(function (req, res) {
