
var express = require('express'),
connect = require('connect');

module.exports = {
'test .version': function(assert){
assert.ok(/^\d+\.\d+\.\d+$/.test(express.version), 'Test express.version format');
},

'test inheritance': function(assert){
var server = express.createServer();
assert.ok(server instanceof connect.Server, 'Test serverlication inheritance');
},

'test basic server': function(assert){
var server = express.createServer();

server.get('/', function(req, res){
res.writeHead(200, {});
res.end('wahoo');
});

server.put('/user/:id', function(req, res, params){
res.writeHead(200, {});
res.end('updated user ' + params.id)
