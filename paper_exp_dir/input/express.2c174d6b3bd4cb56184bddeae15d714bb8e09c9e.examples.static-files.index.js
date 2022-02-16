
var express = require('../..');
var app = express();


app.use(express.logger('dev'));








app.use(express.static(__dirname + '/public'));







app.use('/static', express.static(__dirname + '/public'));





app.use(express.static(__dirname + '/public/css'));

