


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
res.send('<p>test</p>');
});

app.get('/json', function(req, res){
res.header('X-Foo', 'bar');
res.send({ foo: 'bar' }, 201);
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
res.send('Oh shit!', 500);
});

app.get('/buffer', function(req, res){
res.send(new Buffer('wahoo!'));
});

app.get('/204', function(req, res, next){
res.send(204);
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
'Content-Type': 'text/html; charset=utf-8'
}});

assert.response(app,
{ url: '/json' },
{ body: '{"foo":"bar"}'
, status: 201
