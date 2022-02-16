


var express = require('./../../lib/express'),
form = require('./../../support/connect-form'),
sys = require('sys');

var app = express.createServer(



form()
);

app.get('/', function(req, res){
res.send('<form method="post" enctype="form-data/multipart">'
+ '<p>Image: <input type="file" name="image" /></p>'
