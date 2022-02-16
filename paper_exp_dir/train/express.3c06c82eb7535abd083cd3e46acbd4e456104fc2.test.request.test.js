


var express = require('express'),
connect = require('connect'),
MemoryStore = require('connect/middleware/session/memory');


var memoryStore = new MemoryStore({ reapInterval: -1 });

module.exports = {
'#isXMLHttpRequest': function(assert){
var app = express.createServer();

app.get('/isxhr', function(req, res, params){
