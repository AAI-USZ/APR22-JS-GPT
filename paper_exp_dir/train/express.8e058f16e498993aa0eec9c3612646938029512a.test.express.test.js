


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
express.should.have.property('HTTPServer');
express.should.have.property('HTTPSServer');
express.should.have.property('Route');
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

'test basic server': function(){
var server = express.createServer();

server.get('/', function(req, res){
server.set('env').should.equal('test');
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
res.send('POST Staff ' + req.staff.id);
});

server.all('*', function(req, res){
res.send('requested ' + req.url);
});

assert.response(server,
{ url: '/' },
{ body: 'wahoo' });

assert.response(server,
{ url: '/user/12', method: 'PUT' },
{ body: 'updated user 12' });

assert.response(server,
{ url: '/something', method: 'DELETE' },
{ body: 'Destroyed' });

assert.response(server,
{ url: '/something/else', method: 'DELETE' },
{ body: 'Destroyed' });

assert.response(server,
{ url: '/staff/12' },
{ body: 'GET Staff 12' });

assert.response(server,
{ url: '/staff/12', method: 'POST' },
{ body: 'POST Staff 12' });

assert.response(server,
{ url: '/foo/bar/baz', method: 'DELETE' },
{ body: 'requested /foo/bar/baz' });
},

'test constructor middleware': function(beforeExit){
var calls = [];

function one(req, res, next){
calls.push('one');
next();
}

function two(req, res, next){
calls.push('two');
next();
}

var app = express.createServer(one, two);
app.get('/', function(req, res){
res.writeHead(200, {});
res.end('foo bar');
});

assert.response(app,
{ url: '/' },
{ body: 'foo bar' });

beforeExit(function(){
calls.should.eql(['one', 'two']);
});
},

'test next()': function(){
var app = express.createServer();

app.get('/user.:format?', function(req, res, next){
switch (req.params.format) {
case 'json':
res.writeHead(200, {});
res.end('some json');
break;
default:
