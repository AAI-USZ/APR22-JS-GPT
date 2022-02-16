
var express = require('express'),
connect = require('connect');

module.exports = {
'test inheritance': function(assert){
var server = express.createServer();
assert.ok(server instanceof connect.Server, 'Test serverlication inheritance');
},

'test connect middleware autoloaders': function(assert){
assert.equal(express.errorHandler, connect.errorHandler);
},

'test basic server': function(assert){
var server = express.createServer();

server.get('/', function(req, res){
assert.equal('test', server.set('env'), 'env setting was not set properly');
res.writeHead(200, {});
