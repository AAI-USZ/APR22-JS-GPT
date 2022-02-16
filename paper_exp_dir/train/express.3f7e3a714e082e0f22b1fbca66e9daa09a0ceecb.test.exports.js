
var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('exports', function(){
it('should have .version', function(){
express.should.have.property('version');
})

it('should expose connect middleware', function(){
express.should.have.property('bodyParser');
