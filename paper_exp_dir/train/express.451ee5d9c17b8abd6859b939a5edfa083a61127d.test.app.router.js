
var after = require('after');
var express = require('../')
, request = require('supertest')
, assert = require('assert')
, methods = require('methods');

describe('app.router', function(){
it('should restore req.params after leaving router', function(done){
var app = express();
var router = new express.Router();

function handler1(req, res, next){
res.setHeader('x-user-id', String(req.params.id));
next()
}

function handler2(req, res){
res.send(req.params.id);
}

router.use(function(req, res, next){
res.setHeader('x-router', String(req.params.id));
next();
});

app.get('/user/:id', handler1, router, handler2);

request(app)
.get('/user/1')
.expect('x-router', 'undefined')
.expect('x-user-id', '1')
.expect(200, '1', done);
})

describe('methods', function(){
methods.concat('del').forEach(function(method){
if (method === 'connect') return;

it('should include ' + method.toUpperCase(), function(done){
var app = express();

app[method]('/foo', function(req, res){
res.send(method)
});

request(app)
[method]('/foo')
.expect(200, done)
})

it('should reject numbers for app.' + method, function(){
var app = express();
