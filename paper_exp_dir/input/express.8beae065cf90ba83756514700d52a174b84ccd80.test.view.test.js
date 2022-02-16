


var express = require('express'),
connect = require('connect');

module.exports = {
'test #render()': function(assert){
var app = express.createServer(connect.errorHandler({ showMessage: true }));
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
app.get('/invalid', function(req, res){
res.render('invalid.jade', { layout: false });
});
