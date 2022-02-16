


var express = require('express'),
connect = require('connect');

module.exports = {
'#isXMLHttpRequest': function(assert){
var app = express.createServer();

app.get('/isxhr', function(req, res, params){
assert.equal(req.xhr, req.isXMLHttpRequest);
res.send(req.isXMLHttpRequest
