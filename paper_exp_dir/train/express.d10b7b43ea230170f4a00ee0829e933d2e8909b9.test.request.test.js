


var express = require('express')
, connect = require('connect')
, assert = require('assert')
, should = require('should');

module.exports = {
'test #path': function(){
var app = express.createServer();

app.get('/search', function(req, res){
res.send(req.path);
});

assert.response(app,
{ url: '/search?q=tobi' },
{ body: '/search' });
},

