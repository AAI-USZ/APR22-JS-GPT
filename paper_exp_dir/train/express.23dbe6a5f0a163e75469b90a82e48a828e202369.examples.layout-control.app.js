


var express = require('../../lib/express')
, url = require('url');

var app = express.createServer();

app.set('views', __dirname + '/views');


app.register('html', require('ejs'));
app.set('view engine', 'html');


app.locals.layout = 'layouts/default';
