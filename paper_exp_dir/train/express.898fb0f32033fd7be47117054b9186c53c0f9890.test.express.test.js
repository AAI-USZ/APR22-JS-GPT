


var express = require('express')
, connect = require('connect')
, assert = require('assert')
, should = require('should');

module.exports = {
'test inheritance': function(){
var server = express.createServer();
server.should.be.an.instanceof(connect.Server);
},

'test connect middleware autoloaders': function(){
express.errorHandler.should.equal(connect.errorHandler);
},

'test createServer() precedence': function(){
var app = express.createServer(function(req, res){
res.send(req.query.bar);
});

assert.response(app,
{ url: '/foo?bar=baz' },
{ body: 'baz' });
},

