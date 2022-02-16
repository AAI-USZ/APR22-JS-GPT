

var express = require('../../');

var app = module.exports = express();



app.resource = function(path, obj) {
this.get(path, obj.index);
this.get(path + '/:a..:b.:format?', function(req, res){
var a = parseInt(req.params.a, 10);
var b = parseInt(req.params.b, 10);
var format = req.params.format;
