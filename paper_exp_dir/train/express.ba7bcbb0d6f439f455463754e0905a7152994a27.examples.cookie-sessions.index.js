


var express = require('../../');

var app = module.exports = express();


app.use(express.favicon());


app.use(express.cookieParser('manny is cool'));


app.use(express.cookieSession());


app.use(count);


function count(req, res) {
req.session.count = req.session.count || 0;
var n = req.session.count++;
res.send('viewed ' + n + ' times\n');
