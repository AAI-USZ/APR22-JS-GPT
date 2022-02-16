


var express = require('./../../lib/express'),
form = require('./../../support/connect-form'),
connect = require('connect'),
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




