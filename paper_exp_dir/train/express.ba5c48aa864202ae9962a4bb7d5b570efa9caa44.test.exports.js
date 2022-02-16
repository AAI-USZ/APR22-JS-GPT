
var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('exports', function(){
it('should expose connect middleware', function(){
express.should.have.property('bodyParser');
express.should.have.property('session');
express.should.have.property('static');
})

it('should expose .mime', function(){
assert(express.mime == require('connect').mime, 'express.mime should be connect.mime');
})

it('should expose Router', function(){
express.Router.should.be.a('function');
