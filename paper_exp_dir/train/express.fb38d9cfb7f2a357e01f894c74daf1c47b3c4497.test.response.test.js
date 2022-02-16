


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
res.contentType('txt');
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

app.get('/undefined', function(req, res, next){
res.send(undefined);
});

app.get('/bool', function(req, res, next){
res.send(true);
});

assert.response(app,
{ url: '/bool' },
{ body: 'true'
, headers: { 'Content-Type': 'application/json' }});
