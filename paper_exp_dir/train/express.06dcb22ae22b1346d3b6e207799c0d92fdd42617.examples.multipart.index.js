

var express = require('../..');
var bodyParser = require('body-parser');
var format = require('util').format;

var app = module.exports = express();

app.use(bodyParser());

app.get('/', function(req, res){
res.send('<form method="post" enctype="multipart/form-data">'
