


var express = require('../../lib/express');

var app = express.createServer();

app.get('/', function(req, res){
res.send('<ul>'
+ '<li>Download <a href="/files/amazing.txt">amazing.txt</a>.</li>'
+ '<li>Download <a href="/files/missing.txt">missing.txt</a>.</li>'
+ '</ul>');
});



app.get('/files/:file(*)', function(req, res, next){
var file = req.params.file
, path = __dirname + '/files/' + file;



res.download(path, function(err){



if (err) return next(err);




console.log('transferred %s', path);
}, function(err){


});
