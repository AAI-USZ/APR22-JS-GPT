


var express = require('express'),
Buffer = require('buffer').Buffer;

module.exports = {
'test #send()': function(assert){
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
