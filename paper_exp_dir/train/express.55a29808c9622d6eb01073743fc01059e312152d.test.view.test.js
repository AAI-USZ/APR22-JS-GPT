


var express = require('express'),
connect = require('connect');

module.exports = {
'test #render()': function(assert){
var app = express.createServer();
app.set('views', __dirname + '/fixtures');

app.get('/', function(req, res){
res.render('index.jade', { layout: false });
});
app.get('/haml', function(req, res){
res.render('hello.haml', { layout: false });
});
app.get('/callback', function(req, res){
res.render('hello.haml', { layout: false }, function(err, str){
assert.ok(!err);
res.send(str.replace('Hello World', ':)'));
});
});

assert.response(app,
{ url: '/' },
{ body: '<p>Welcome</p>' });
