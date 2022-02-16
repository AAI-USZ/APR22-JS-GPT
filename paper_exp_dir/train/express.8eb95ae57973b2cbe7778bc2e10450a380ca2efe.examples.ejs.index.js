

var express = require('../../');
var path = require('path');

var app = module.exports = express();












app.engine('.html', require('ejs').__express);



app.set('views', path.join(__dirname, 'views'));




app.set('view engine', 'html');


