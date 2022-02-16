


var express = require('../../lib/express');

var app = express.createServer();



app.resource = function(path, obj) {
this.get(path, obj.index);
