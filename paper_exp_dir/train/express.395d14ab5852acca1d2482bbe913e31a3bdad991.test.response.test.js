


var express = require('express');

module.exports = {
'#send()': function(assert){
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
res.contentType('.txt');
res.send('wahoo');
});

app.get('/status', function(req, res){
res.send(404);
});

app.get('/error', function(req, res){
res.send('Oh shit!', 500);
});

assert.response(app,
{ url: '/html' },
