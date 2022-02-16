
var assert = require('assert')
var express = require('../');
var request = require('supertest');
var should = require('should');

describe('exports', function(){
it('should expose Router', function(){
express.Router.should.be.a.Function()
})

it('should expose json middleware', function () {
assert.equal(typeof express.json, 'function')
assert.equal(express.json.length, 1)
})

it('should expose urlencoded middleware', function () {
assert.equal(typeof express.urlencoded, 'function')
assert.equal(express.urlencoded.length, 1)
})

it('should expose the application prototype', function(){
express.application.set.should.be.a.Function()
})

it('should expose the request prototype', function(){
