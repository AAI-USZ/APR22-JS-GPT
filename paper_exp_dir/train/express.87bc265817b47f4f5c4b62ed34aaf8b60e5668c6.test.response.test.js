


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

