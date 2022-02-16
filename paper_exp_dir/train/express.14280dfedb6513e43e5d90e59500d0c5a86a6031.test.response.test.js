


var express = require('express'),
Buffer = require('buffer').Buffer;

module.exports = {
'#send()': function(assert){
var app = express.createServer();

app.get('/html', function(req, res){
res.send('<p>test</p>', { 'Content-Language': 'en' });
});
