
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

it('should expose raw middleware', function () {
assert.equal(typeof express.raw, 'function')
assert.equal(express.raw.length, 1)
})

it('should expose static middleware', function () {
assert.equal(typeof express.static, 'function')
assert.equal(express.static.length, 2)
})

it('should expose text middleware', function () {
assert.equal(typeof express.text, 'function')
assert.equal(express.text.length, 1)
})

it('should expose urlencoded middleware', function () {
assert.equal(typeof express.urlencoded, 'function')
assert.equal(express.urlencoded.length, 1)
})

it('should expose the application prototype', function(){
express.application.set.should.be.a.Function()
