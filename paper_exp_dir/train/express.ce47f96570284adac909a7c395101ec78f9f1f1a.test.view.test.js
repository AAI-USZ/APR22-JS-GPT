


var express = require('express')
, connect = require('connect')
, assert = require('assert')
, should = require('should')
, View = require('../lib/view')
, partial = require('../lib/view/partial')



var create = function(){
var app = express.createServer.apply(express, arguments);
app.set('views', __dirname + '/fixtures');
return app;
};

module.exports = {
'test View#path': function(){
var view = new View('forum/thread.ejs', { root: '/www/mysite/views' });
view.path.should.equal('/www/mysite/views/forum/thread.ejs');

