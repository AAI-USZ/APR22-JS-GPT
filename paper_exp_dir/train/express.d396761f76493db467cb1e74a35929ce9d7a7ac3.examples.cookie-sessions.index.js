


var express = require('../../');

var app = module.exports = express();


app.use(express.cookieParser('manny is cool'));


app.use(express.cookieSessions());


app.use(count);


function count(req, res) {
req.session.count = req.session.count || 0;
var n = req.session.count++;
