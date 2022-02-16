


var express = require('express'),
connect = require('connect');

module.exports = {
'test #render()': function(assert){
var app = express.createServer(connect.errorHandler({ showMessage: true }));
app.set('views', __dirname + '/fixtures');
