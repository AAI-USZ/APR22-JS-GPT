var express = require('../..');

var app = module.exports = express();




app.engine('html', require('ejs').renderFile);


app.set('view engine', 'html');


app.set('views', __dirname + '/views');

