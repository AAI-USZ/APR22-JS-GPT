


var express = require('../../lib/express');

var app = express.createServer();

app.set('views', __dirname + '/views');


app.set('view options', { layout: 'layouts/default' });




app.set('view engine', 'ejs');

app.get('/', function(req, res){
res.render('pages/default');
