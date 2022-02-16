
var after = require('after');
var should = require('should');
var express = require('../')
, Route = express.Route
, methods = require('methods')
, assert = require('assert');

describe('Route', function(){
it('should work without handlers', function(done) {
var req = { method: 'GET', url: '/' }
var route = new Route('/foo')
route.dispatch(req, {}, done)
})

describe('.all', function(){
it('should add handler', function(done){
var req = { method: 'GET', url: '/' };
var route = new Route('/foo');

route.all(function(req, res, next) {
req.called = true;
next();
});

route.dispatch(req, {}, function (err) {
if (err) return done(err);
done();
});
})

it('should handle VERBS', function(done) {
var count = 0;
var route = new Route('/foo');
var cb = after(methods.length, function (err) {
if (err) return done(err);
count.should.equal(methods.length);
done();
});

route.all(function(req, res, next) {
count++;
next();
});

methods.forEach(function testMethod(method) {
var req = { method: method, url: '/' };
route.dispatch(req, {}, cb);
});
})

it('should stack', function(done) {
var req = { count: 0, method: 'GET', url: '/' };
var route = new Route('/foo');

route.all(function(req, res, next) {
req.count++;
next();
});

route.all(function(req, res, next) {
req.count++;
next();
});

route.dispatch(req, {}, function (err) {
if (err) return done(err);
req.count.should.equal(2);
done();
});
})
})

describe('.VERB', function(){
it('should support .get', function(done){
var req = { method: 'GET', url: '/' };
var route = new Route('');

route.get(function(req, res, next) {
req.called = true;
next();
})

route.dispatch(req, {}, function (err) {
if (err) return done(err);
done();
});
})

it('should limit to just .VERB', function(done){
var req = { method: 'POST', url: '/' };
var route = new Route('');

route.get(function(req, res, next) {
throw new Error('not me!');
})

route.post(function(req, res, next) {
req.called = true;
next();
})

route.dispatch(req, {}, function (err) {
if (err) return done(err);
