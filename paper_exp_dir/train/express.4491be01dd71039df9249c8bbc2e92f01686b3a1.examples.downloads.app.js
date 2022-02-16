


var express = require('./../../lib/express');

var app = express.createServer();

app.get('/', function(req, res){
res.send('<ul>'
+ '<li>Download <a href="/files/amazing.txt">amazing.txt</a>.</li>'
+ '<li>Download <a href="/files/missing.txt">missing.txt</a>.</li>'
+ '</ul>');
});



app.get('/files/:file(*)', function(req, res){
var file = req.params.file;
res.download(__dirname + '/files/' + file);
});

app.error(function(err, req, res, next){
if (process.ENOENT == err.errno) {
res.send('Cant find that file, sorry!');
