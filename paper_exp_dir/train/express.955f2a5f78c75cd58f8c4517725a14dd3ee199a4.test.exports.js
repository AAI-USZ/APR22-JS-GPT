
var assert = require('assert')
var express = require('../');
var request = require('supertest');
var should = require('should');

describe('exports', function(){
it('should expose Router', function(){
express.Router.should.be.a.Function()
})

