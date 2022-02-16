


var express = require('express'),
connect = require('connect'),
view = require('express/view');

module.exports = {
'test #render()': function(assert){
var app = express.createServer(connect.errorHandler({ showMessage: true }));
app.set('views', __dirname + '/fixtures');
app.set('view engine', 'jade');

app.get('/', function(req, res){
res.render('index.jade', { layout: false });
});
app.get('/jade', function(req, res){
