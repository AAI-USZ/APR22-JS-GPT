
var express = require('../')
, request = require('supertest')
, assert = require('assert')
, methods = require('methods');

describe('app.router', function(){
describe('methods supported', function(){
methods.concat('del').forEach(function(method){
if (method === 'connect') return;

it('should include ' + method.toUpperCase(), function(done){
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
if ('head' == method) {
res.end();
} else {
res.end(method);
}
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
})

it('should reject numbers for app.' + method, function(){
var app = express();
app[method].bind(app, '/', 3).should.throw(/Number/);
})
});
})

describe('decode querystring', function(){
it('should decode correct params', function(done){
