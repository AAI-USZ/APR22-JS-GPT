
var express = require('../..');
var logger = require('morgan');
var app = express();


app.use(logger('dev'));








app.use(express.static(__dirname + '/public'));







app.use('/static', express.static(__dirname + '/public'));





app.use(express.static(__dirname + '/public/css'));

app.listen(3000);
console.log('listening on port 3000');
console.log('try:');
console.log('  GET /hello.txt');
console.log('  GET /js/app.js');
console.log('  GET /css/style.css');
