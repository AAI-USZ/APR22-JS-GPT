


var express = require('./../../lib/express'),
connect = require('connect'),
sys = require('sys');

var app = express.createServer(



connect.bodyDecoder(),




connect.methodOverride()
);

app.get('/', function(req, res){

var name = req.param('name') || '';


var label = name ? 'Update' : 'Save';



res.send('<form method="post">'
+ (name ? '<input type="hidden" value="put" name="_method" />' : '')
