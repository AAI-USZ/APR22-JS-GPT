
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
.expect('', done);
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
