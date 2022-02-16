


var express = require('express');

module.exports = {
'#send()': function(assert){
var app = express.createServer();

app.get('/html', function(req, res){
res.send('<p>test</p>', { 'Content-Language': 'en' });
});

app.get('/json', function(req, res){
res.send({ foo: 'bar' }, {}, 201);
});

assert.response(app,
{ url: '/html' },
{ body: '<p>test</p>', headers: { 'Content-Language': 'en', 'Content-Type': 'text/html; charset=utf8' }});
assert.response(app,
{ url: '/json' },
{ body: '{"foo":"bar"}', status: 201, headers: { 'Content-Type': 'application/json; charset=utf8' }});
