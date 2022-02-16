


var express = require('../..')
, bodyParser = require('body-parser')
, format = require('util').format;

var app = module.exports = express()

app.use(bodyParser())

app.get('/', function(req, res){
res.send('<form method="post" enctype="multipart/form-data">'
+ '<p>Title: <input type="text" name="title" /></p>'
+ '<p>Image: <input type="file" name="image" /></p>'
