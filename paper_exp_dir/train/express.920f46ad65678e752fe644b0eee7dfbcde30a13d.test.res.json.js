
var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('res', function(){
describe('.json(object)', function(){
it('should not support jsonp callbacks', function(done){
var app = express();

app.use(function(req, res){
res.json({ foo: 'bar' });
});

request(app)
.get('/?callback=foo')
.expect('{"foo":"bar"}', done);
})

describe('when given primitives', function(){
it('should respond with json for null', function(done){
var app = express();

app.use(function(req, res){
res.json(null);
});

request(app)
.get('/')
.end(function(err, res){
res.headers.should.have.property('content-type', 'application/json; charset=utf-8');
res.text.should.equal('null');
done();
})
})

it('should respond with json for Number', function(done){
var app = express();

app.use(function(req, res){
res.json(300);
});

request(app)
