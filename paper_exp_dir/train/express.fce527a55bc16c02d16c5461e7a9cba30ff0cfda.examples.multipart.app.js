


var express = require('./../../lib/express'),
connect = require('connect'),
form = require('connect-form'),
sys = require('sys');

var app = express.createServer(



form(),


connect.redirect()
);

app.get('/', function(req, res){
res.send('<form method="post" enctype="form-data/multipart">'
+ '<p>Image: <input type="file" name="image" /></p>'
+ '<p><input type="submit" value="Upload" /></p>'
+ '</form>');
});

app.post('/', function(req, res){


req.form.addListener('progress', function(bytesReceived, bytesExpected){
var percent = (bytesReceived / bytesExpected * 100) | 0;
sys.print('Uploading: %' + percent + '\r');
