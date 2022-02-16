

var express = require('../../');
var app = module.exports = express();

app.get('/', function(req, res){
res.send('<ul>'
+ '<li>Download <a href="/files/amazing.txt">amazing.txt</a>.</li>'
+ '<li>Download <a href="/files/utf-8 한中日.txt">utf-8 한中日.txt</a>.</li>'
+ '<li>Download <a href="/files/missing.txt">missing.txt</a>.</li>'
+ '</ul>');
});



app.get('/files/:file(*)', function(req, res, next){
var file = req.params.file;
var path = __dirname + '/files/' + file;

res.download(path);
