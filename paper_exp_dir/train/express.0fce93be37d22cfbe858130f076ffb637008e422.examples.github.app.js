


var express = require('./../../lib/express'),
connect = require('connect'),
http = require('http');

var app = express.createServer();



app.set('views', __dirname + '/views');



function request(path, fn){
var client = http.createClient(80, 'github.com'),
req = client.request('GET', '/api/v2/json' + path, { Host: 'github.com' });
req.addListener('response', function(res){
res.body = '';
res.addListener('data', function(chunk){ res.body += chunk; });
