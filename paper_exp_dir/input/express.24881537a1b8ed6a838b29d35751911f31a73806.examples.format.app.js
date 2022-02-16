


var express = require('../../lib/express');

var app = express.createServer();



var items = [
{ name: 'foo' },
{ name: 'bar' },
{ name: 'baz' }
];



app.get('/', function(req, res, next){
res.send('Visit /item/2');
});

app.get('/item/:id.:format?', function(req, res, next){
var id = req.params.id,
format = req.params.format,
item = items[id];
