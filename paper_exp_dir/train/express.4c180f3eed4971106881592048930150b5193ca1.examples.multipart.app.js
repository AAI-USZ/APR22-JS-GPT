


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

app.post('/', function(req, res){



req.form.onComplete = function(err, fields, files){
sys.puts('\nuploaded ' + files.image.filename);
res.redirect('/');
};



req.form.addListener('progress', function(bytesReceived, bytesExpected){
var percent = (bytesReceived / bytesExpected * 100) | 0;
sys.print('Uploading: %' + percent + '\r');
