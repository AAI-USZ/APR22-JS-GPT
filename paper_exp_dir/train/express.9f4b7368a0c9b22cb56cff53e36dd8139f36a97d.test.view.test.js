


var express = require('express')
, connect = require('connect')
, assert = require('assert')
, should = require('should')
, View = require('express/view');



var create = function(){
var app = express.createServer.apply(express, arguments);
app.set('views', __dirname + '/fixtures');
return app;
};

module.exports = {
'test View#path': function(){
var view = new View('forum/thread.ejs', { root: '/www/mysite/views' });
view.path.should.equal('/www/mysite/views/forum/thread.ejs');

var view = new View('/www/mysite/views/path.ejs');
view.path.should.equal('/www/mysite/views/path.ejs');

var view = new View('user', { parentView: view });
view.path.should.equal('/www/mysite/views/user.ejs');

