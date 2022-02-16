
var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('exports', function(){
it('should expose Router', function(){
express.Router.should.be.a.Function;
})

it('should expose the application prototype', function(){
express.application.set.should.be.a.Function;
})

it('should expose the request prototype', function(){
express.request.accepts.should.be.a.Function;
