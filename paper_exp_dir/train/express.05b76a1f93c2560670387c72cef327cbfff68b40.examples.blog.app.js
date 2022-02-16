


var express = require('../../lib/express');

var app = module.exports = express.createServer();



app.set('views', __dirname + '/views');
app.set('view engine', 'jade');



app.mounted(function(other){
console.log('ive been mounted!');
});
