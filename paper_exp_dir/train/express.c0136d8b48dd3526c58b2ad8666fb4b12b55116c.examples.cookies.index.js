

var express = require('../../');
var app = module.exports = express();
var logger = require('morgan');
var cookieParser = require('cookie-parser');


if ('test' != process.env.NODE_ENV) app.use(logger(':method :url'));





app.use(cookieParser('my secret here'));


app.use(express.urlencoded({ extended: false }))

app.get('/', function(req, res){
if (req.cookies.remember) {
res.send('Remembered :). Click to <a href="/forget">forget</a>!.');
