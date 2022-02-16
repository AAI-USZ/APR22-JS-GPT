

var express = require('../../');
var path = require('path');
var app = module.exports = express();

app.get('/', function(req, res){
res.send('<ul>'
+ '<li>Download <a href="/files/amazing.txt">amazing.txt</a>.</li>'
+ '<li>Download <a href="/files/missing.txt">missing.txt</a>.</li>'
+ '<li>Download <a href="/files/CCTV大赛上海分赛区.txt">CCTV大赛上海分赛区.txt</a>.</li>'
+ '</ul>');
});
