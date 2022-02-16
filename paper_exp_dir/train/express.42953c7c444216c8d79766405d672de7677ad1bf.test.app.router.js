
var express = require('../')
, request = require('./support/http');

describe('app.router', function(){
describe('methods supported', function(){
express.methods.forEach(function(method){
it('should include ' + method.toUpperCase(), function(done){
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
res.end(method);
});

request(app)
[method]('/foo')
.expect('head' == method ? '' : method, done);
})
});
})

describe('OPTIONS', function(){
it('should default to the routes defined', function(done){
var app = express();

app.get('/users', function(req, res){

});

app.put('/users', function(req, res){

});
