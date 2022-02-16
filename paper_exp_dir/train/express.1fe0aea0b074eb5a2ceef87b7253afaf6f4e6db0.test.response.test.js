


var express = require('express')
, Stream = require('stream').Stream
, assert = require('assert')
, should = require('should');

module.exports = {
'test #send()': function(){
var app = express.createServer();

app.get('/html', function(req, res){
res.send('<p>test</p>', { 'Content-Language': 'en' });
});

app.get('/json', function(req, res){
res.header('X-Foo', 'bar');
res.send({ foo: 'bar' }, { 'X-Foo': 'baz' }, 201);
});

app.get('/jsonp', function(req, res){
app.enable('jsonp callback');
res.header('X-Foo', 'bar');
res.send({ foo: 'bar' }, { 'X-Foo': 'baz' }, 201);
app.disable('jsonp callback');
});

app.get('/text', function(req, res){
res.header('X-Foo', 'bar');
res.contentType('.txt');
res.send('wahoo');
});

app.get('/status', function(req, res){
res.send(404);
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

assert.response(app,
{ url: '/html' },
{ body: '<p>test</p>'
, headers: {
'Content-Language': 'en'
, 'Content-Type': 'text/html; charset=utf8'
}});

assert.response(app,
{ url: '/json' },
{ body: '{"foo":"bar"}'
, status: 201
, headers: {
'Content-Type': 'application/json'
, 'X-Foo': 'baz'
}});

assert.response(app,
{ url: '/jsonp?callback=test' },
{ body: 'test({"foo":"bar"});'
, status: 201
, headers: {
'Content-Type': 'text/javascript'
, 'X-Foo': 'baz'
}});

assert.response(app,
{ url: '/jsonp?callback=baz' },
{ body: 'baz({"foo":"bar"});'
, status: 201, headers: {
'Content-Type': 'text/javascript'
, 'X-Foo': 'baz'
}});

assert.response(app,
{ url: '/jsonp?callback=invalid()[]' },
{ body: 'invalid({"foo":"bar"});'
, status: 201
, headers: {
'Content-Type': 'text/javascript'
, 'X-Foo': 'baz'
}});

assert.response(app,
{ url: '/json?callback=test' },
{ body: '{"foo":"bar"}'
, status: 201
, headers: {
'Content-Type': 'application/json'
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
{ url: '/status' },
{ body: 'Not Found'
, status: 404
, headers: { 'Content-Type': 'text/plain' }});

assert.response(app,
{ url: '/error' },
{ body: 'Oh shit!'
, status: 500
, headers: {
'Content-Type': 'text/plain; charset=utf8'
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
},

'test #contentType()': function(){
var app = express.createServer();

app.get('/html', function(req, res){
res.contentType('index.html');
res.writeHead(200, res.headers);
res.end('<p>yay</p>');
});

app.get('/json', function(req, res, next){
res.contentType('json');
res.send('{"foo":"bar"}');
});

app.get('/literal', function(req, res){
res.contentType('application/json');
res.send('{"foo":"bar"}')
});

assert.response(app,
{ url: '/literal' },
{ headers: { 'Content-Type': 'application/json' }});
assert.response(app,
{ url: '/html' },
