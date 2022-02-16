


var express = require('../../lib/express');

var app = express.createServer();



app.resource = function(path, obj) {
this.get(path, obj.index);
this.get(path + '/:a..:b.:format?', function(req, res){
var a = parseInt(req.params.a, 10)
, b = parseInt(req.params.b, 10)
