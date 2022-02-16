

var express = require('../..');
var multiparty = require('multiparty');
var format = require('util').format;

var app = module.exports = express();

app.get('/', function(req, res){
res.send('<form method="post" enctype="multipart/form-data">'
+ '<p>Title: <input type="text" name="title" /></p>'
+ '<p>Image: <input type="file" name="image" /></p>'
+ '<p><input type="submit" value="Upload" /></p>'
