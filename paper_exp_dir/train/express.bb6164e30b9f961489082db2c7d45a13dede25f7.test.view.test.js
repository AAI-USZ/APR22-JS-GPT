


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

