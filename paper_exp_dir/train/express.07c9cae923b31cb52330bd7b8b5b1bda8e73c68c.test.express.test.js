


var express = require('express')
, connect = require('connect')
, assert = require('assert')
, should = require('should');

module.exports = {
'test inheritance': function(){
var server = express.createServer();
server.should.be.an.instanceof(connect.HTTPServer);
},

'test constructor exports': function(){
express.should.have.property('HTTPServer');
express.should.have.property('HTTPSServer');
},

'test connect middleware autoloaders': function(){
express.errorHandler.should.equal(connect.errorHandler);
},

'test createServer() precedence': function(){
var app = express.createServer(function(req, res){
