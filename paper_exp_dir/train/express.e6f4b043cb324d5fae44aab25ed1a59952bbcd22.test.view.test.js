


var express = require('express'),
connect = require('connect'),
view = require('express/view');

var create = function(){
var app = express.createServer.apply(express, arguments);
app.set('views', __dirname + '/fixtures');
return app;
};

module.exports = {
'test #render()': function(assert){
var app = create(connect.errorHandler({ showMessage: true }));
app.set('view engine', 'jade');

app.get('/', function(req, res){
res.render('index.jade', { layout: false });
});
app.get('/jade', function(req, res){
res.render('index', { layout: false });
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
app.get('/invalid', function(req, res){
res.render('invalid.jade', { layout: false });
});
app.get('/invalid-async', function(req, res){
process.nextTick(function(){
res.render('invalid.jade', { layout: false });
});
});
app.get('/error', function(req, res){
res.render('invalid.jade', { layout: false }, function(err){
res.send(err.arguments[0]);
});
});
app.get('/absolute', function(req, res){
res.render(__dirname + '/fixtures/index.jade', { layout: false });
});

assert.response(app,
{ url: '/' },
{ body: '<p>Welcome</p>', headers: { 'Content-Type': 'text/html; charset=utf-8' }});
assert.response(app,
{ url: '/jade' },
{ body: '<p>Welcome</p>' });
assert.response(app,
{ url: '/absolute' },
{ body: '<p>Welcome</p>' });
