
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
