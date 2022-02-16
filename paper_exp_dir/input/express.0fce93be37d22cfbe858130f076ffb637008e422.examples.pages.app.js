


var express = require('./../../lib/express');

var app = express.createServer();

app.set('views', __dirname + '/views');

app.get('/', function(req, res){
res.render('index.jade');
});

app.get('/404', function(req, res){
err.errno = process.ENOENT;
throw err;
});

app.get('/500', function(req, res){
throw new Error('keyboard cat!');
});
