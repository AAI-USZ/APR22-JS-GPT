


var express = require('../../lib/express');

var app = express.createServer();



app.register('.html', require('ejs'));



app.set('views', __dirname + '/views');
app.set('view engine', 'html');


