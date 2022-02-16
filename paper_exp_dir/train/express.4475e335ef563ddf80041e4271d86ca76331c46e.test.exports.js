
var express = require('../')
, request = require('./support/http');

describe('exports', function(){
it('should have .version', function(){
express.should.have.property('version');
})

it('should expose connect middleware', function(){
express.should.have.property('bodyParser');
express.should.have.property('session');
express.should.have.property('static');
})

it('should expose .mime', function(){
express.mime.should.equal(require('connect').mime);
})

it('should expose HTTP methods', function(){
express.methods.should.be.an.instanceof(Array);
express.methods.should.include('get');
express.methods.should.include('put');
express.methods.should.include('post');
})

it('should expose Router', function(){
