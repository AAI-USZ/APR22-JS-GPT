
var express = require('../')
, request = require('./support/http');

describe('app.router', function(){
describe('methods supported', function(){
express.methods.forEach(function(method){
it('should include ' + method, function(done){
var app = express();
var calls = [];

app[method]('/foo', function(req, res){
res.end(method);
});

request(app)
[method]('/foo')
