

var express = require('../../');

var app = module.exports = express();












app.engine('.html', require('ejs').__express);



app.set('views', __dirname + '/views');




app.set('view engine', 'html');

