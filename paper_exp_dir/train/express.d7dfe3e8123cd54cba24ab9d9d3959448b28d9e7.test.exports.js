
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

it('should expose HTTP methods', function(){
express.methods.should.be.an.instanceof(Array);
express.methods.should.contain('get');
express.methods.should.contain('put');
express.methods.should.contain('post');
})

it('should expose Router', function(){
express.Router.should.be.a('function');
})

it('should expose the application prototype', function(){
express.application.set.should.be.a('function');
})

it('should expose the request prototype', function(){
express.request.accepts.should.be.a('function');
})

it('should expose the response prototype', function(){
express.response.send.should.be.a('function');
})

