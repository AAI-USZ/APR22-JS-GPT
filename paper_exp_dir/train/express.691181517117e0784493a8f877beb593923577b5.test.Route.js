
var express = require('../')
, Route = express.Route
, methods = require('methods')
, assert = require('assert');

describe('Route', function(){

describe('.all', function(){
it('should add handler', function(done){
var route = new Route('/foo');

route.all(function(req, res, next) {
assert.equal(req.a, 1);
assert.equal(res.b, 2);
next();
});

route.dispatch({ a:1, method: 'GET' }, { b:2 }, done);
