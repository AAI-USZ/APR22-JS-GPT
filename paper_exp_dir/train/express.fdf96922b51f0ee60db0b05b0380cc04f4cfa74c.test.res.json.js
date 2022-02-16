
var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('res', function(){
describe('.json(object)', function(){
describe('when given primitives', function(){
it('should respond with json', function(done){
var app = express();

app.use(function(req, res){
res.json(null);
});

request(app)
.get('/')
.end(function(res){
res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
res.body.should.equal('null');
done();
})
})
})

describe('when given an array', function(){
it('should respond with json', function(done){
var app = express();

app.use(function(req, res){
res.json(['foo', 'bar', 'baz']);
});

request(app)
.get('/')
.end(function(res){
res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
res.body.should.equal('["foo","bar","baz"]');
done();
})
})
})

describe('when given an object', function(){
it('should respond with json', function(done){
var app = express();

app.use(function(req, res){
res.json({ name: 'tobi' });
});

request(app)
