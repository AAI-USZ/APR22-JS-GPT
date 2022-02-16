


var express = require('express')
, connect = require('connect')
, assert = require('assert')
, should = require('should')
, Route = express.Route;

module.exports = {
'test inheritance': function(){
var server = express.createServer();
server.should.be.an.instanceof(connect.HTTPServer);
},

'test constructor exports': function(){
