


var express = require('express')
, Stream = require('stream').Stream
, assert = require('assert')
, should = require('should');

module.exports = {
'test #json()': function(){
var app = express.createServer()
, json = 'application/json; charset=utf-8';

app.get('/user', function(req, res, next){
res.json({ name: 'tj' });
});

app.get('/string', function(req, res, next){
res.json('whoop!');
});

app.get('/error', function(req, res, next){
res.json('oh noes!', 500);
});

