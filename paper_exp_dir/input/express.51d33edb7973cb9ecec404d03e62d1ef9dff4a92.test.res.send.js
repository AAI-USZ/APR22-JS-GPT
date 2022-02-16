
var express = require('../')
, request = require('supertest')
, assert = require('assert');

describe('res', function(){
describe('.send(null)', function(){
it('should set body to ""', function(done){
var app = express();

app.use(function(req, res){
res.send(null);
});

request(app)
.get('/')
.expect('Content-Length', '0')
.expect('', done);
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
.expect('', function(req, res){
res.header.should.not.have.property('content-length');
done();
});
})
})

describe('.send(code)', function(){
it('should set .statusCode', function(done){
var app = express();

app.use(function(req, res){
res.send(201).should.equal(res);
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
.end(function(err, res){
res.headers.should.have.property('content-type', 'text/html; charset=utf-8');
res.text.should.equal('<p>hey</p>');
res.statusCode.should.equal(200);
done();
})
})

it('should set ETag', function(done){
var app = express();

app.use(function(req, res){
res.send(str);
});

request(app)
.get('/')
.end(done);
})

it('should not set ETag for non-GET/HEAD', function(done){
var app = express();

app.use(function(req, res){
