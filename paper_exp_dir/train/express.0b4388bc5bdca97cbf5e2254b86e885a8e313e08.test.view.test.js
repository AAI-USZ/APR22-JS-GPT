


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
var app = create();
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
app.get('/callback/layout', function(req, res){
res.render('hello.jade', {}, function(err, str){
assert.ok(!err);
res.send(str.replace(':(', ':)'));
});
});
app.get('/callback', function(req, res){
res.render('hello.haml', { layout: false }, function(err, str){
assert.ok(!err);
res.send(str.replace('Hello World', ':)'));
});
});
app.get('/invalid', function(req, res){
