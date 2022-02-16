


var express = require('../../lib/express')
, form = require('connect-form');

var app = express.createServer(



form({ keepExtensions: true })
);

app.get('/', function(req, res){
res.send('<form method="post" enctype="multipart/form-data">'
