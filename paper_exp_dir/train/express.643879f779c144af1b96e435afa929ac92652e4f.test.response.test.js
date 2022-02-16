


var express = require('express')
, Buffer = require('buffer').Buffer
, assert = require('assert')
, should = require('should');

module.exports = {
'test #send()': function(){
var app = express.createServer();

app.get('/html', function(req, res){
