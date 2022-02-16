


var express = require('express')
, Stream = require('stream').Stream
, assert = require('assert')
, should = require('should');

module.exports = {
'test #json()': function(){
var app = express.createServer()
, json = 'application/json; charset=utf-8';

app.get('/user', function(req, res, next){
res.json({ name: 'tj' });
});

app.get('/string', function(req, res, next){
res.json('whoop!');
});

app.get('/error', function(req, res, next){
res.json('oh noes!', 500);
});

app.get('/headers', function(req, res, next){
res.json(undefined, { 'X-Foo': 'bar' }, 302);
});

assert.response(app,
{ url: '/error' },
{ body: '"oh noes!"'
, status: 500
, headers: { 'Content-Type': json }});

assert.response(app,
{ url: '/string' },
{ body: '"whoop!"'
, headers: {
'Content-Type': json
, 'Content-Length': 8
}});

assert.response(app,
{ url: '/user' },
{ body: '{"name":"tj"}', headers: { 'Content-Type': json }});
},

'test #status()': function(){
var app = express.createServer();

app.get('/error', function(req, res, next){
res.status(500).send('OH NO');
});

assert.response(app,
{ url: '/error' },
{ body: 'OH NO', status: 500 });
},

'test #send()': function(){
var app = express.createServer();

app.get('/html', function(req, res){
res.send('<p>test</p>', { 'Content-Language': 'en' });
});

app.get('/json', function(req, res){
res.header('X-Foo', 'bar');
res.send({ foo: 'bar' }, { 'X-Foo': 'baz' }, 201);
});

app.get('/text', function(req, res){
res.header('X-Foo', 'bar');
res.contentType('txt');
res.send('wahoo');
});

app.get('/status', function(req, res){
res.send(404);
});

app.get('/status/text', function(req, res){
res.send('Oh noes!', 404);
});

app.get('/error', function(req, res){
res.send('Oh shit!', { 'Content-Type': 'text/plain' }, 500);
});

app.get('/buffer', function(req, res){
res.send(new Buffer('wahoo!'));
});

app.get('/noargs', function(req, res, next){
res.send();
});

app.get('/undefined', function(req, res, next){
res.send(undefined);
});

app.get('/bool', function(req, res, next){
res.send(true);
});

assert.response(app,
{ url: '/bool' },
{ body: 'true'
, headers: { 'Content-Type': 'application/json; charset=utf-8' }});

assert.response(app,
{ url: '/html' },
{ body: '<p>test</p>'
, headers: {
'Content-Language': 'en'
, 'Content-Type': 'text/html; charset=utf-8'
}});

assert.response(app,
{ url: '/json' },
{ body: '{"foo":"bar"}'
, status: 201
, headers: {
'Content-Type': 'application/json; charset=utf-8'
, 'X-Foo': 'baz'
}});

assert.response(app,
{ url: '/text' },
{ body: 'wahoo'
, headers: {
'Content-Type': 'text/plain'
, 'X-Foo': 'bar'
}});

assert.response(app,
{ url: '/status/text' },
{ body: 'Oh noes!', status: 404 });

assert.response(app,
{ url: '/status' },
{ body: 'Not Found'
, status: 404
, headers: { 'Content-Type': 'text/plain' }});

assert.response(app,
{ url: '/error' },
{ body: 'Oh shit!'
, status: 500
, headers: {
'Content-Type': 'text/plain; charset=utf-8'
, 'Content-Length': '8'
}});

assert.response(app,
{ url: '/buffer' },
{ body: 'wahoo!'
, headers: {
'Content-Type': 'application/octet-stream'
, 'Content-Length': '6'
}});

assert.response(app,
{ url: '/noargs' },
{ status: 204 }, function(res){
assert.equal(undefined, res.headers['content-type']);
assert.equal(undefined, res.headers['content-length']);
});

assert.response(app,
{ url: '/undefined' },
{ status: 204 }, function(res){
assert.equal(undefined, res.headers['content-type']);
assert.equal(undefined, res.headers['content-length']);
});

assert.response(app,
{ url: '/json?callback=test' },
{ body: '{"foo":"bar"}'
, status: 201
, headers: {
'Content-Type': 'application/json; charset=utf-8'
, 'X-Foo': 'baz'
}});
},

'test #send() JSONP': function(){
var app = express.createServer();

app.enable('jsonp callback');

app.get('/jsonp', function(req, res){
res.header('X-Foo', 'bar');
res.send({ foo: 'bar' }, { 'X-Foo': 'baz' }, 201);
});

assert.response(app,
{ url: '/jsonp?callback=test' },
{ body: 'test({"foo":"bar"});'
, status: 201
, headers: {
'Content-Type': 'text/javascript; charset=utf-8'
, 'X-Foo': 'baz'
}});

assert.response(app,
{ url: '/jsonp?callback=baz' },
{ body: 'baz({"foo":"bar"});'
, status: 201, headers: {
'Content-Type': 'text/javascript; charset=utf-8'
, 'X-Foo': 'baz'
}});

assert.response(app,
{ url: '/jsonp?callback=invalid()[]' },
{ body: 'invalid({"foo":"bar"});'
, status: 201
, headers: {
'Content-Type': 'text/javascript; charset=utf-8'
, 'X-Foo': 'baz'
}});
},

'test #json() JSONP': function(){
var app = express.createServer();

app.enable('jsonp callback');

app.get('/jsonp', function(req, res){
res.header('X-Foo', 'bar');
res.json({ foo: 'bar' }, { 'X-Foo': 'baz' }, 201);
});

assert.response(app,
{ url: '/jsonp?callback=test' },
