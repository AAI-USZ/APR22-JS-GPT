


var express = require('../../');

var app = module.exports = express();

app.get('/', function(req, res){
res.send('Hello World');
});

if (!module.parent) {
