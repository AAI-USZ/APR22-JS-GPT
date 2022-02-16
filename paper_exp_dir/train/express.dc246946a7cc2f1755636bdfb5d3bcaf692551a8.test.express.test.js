
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
res.end('wahoo');
});

server.put('/user/:id', function(req, res){
res.writeHead(200, {});
res.end('updated user ' + req.params.id)
});

server.del('/something', function(req, res){
res.send('Destroyed');
});

server.delete('/something/else', function(req, res){
res.send('Destroyed');
});

server.all('/staff/:id', function(req, res, next){
req.staff = { id: req.params.id };
next();
});

server.get('/staff/:id', function(req, res){
res.send('GET Staff ' + req.staff.id);
});

server.post('/staff/:id', function(req, res){
