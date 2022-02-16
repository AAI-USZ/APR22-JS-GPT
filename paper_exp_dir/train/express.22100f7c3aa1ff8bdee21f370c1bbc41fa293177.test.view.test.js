


var express = require('express'),
connect = require('connect');

module.exports = {
'test #render()': function(assert){
var app = express.createServer();
app.set('views', __dirname + '/fixtures');

app.get('/', function(req, res){
res.render('index.jade', { layout: false });
