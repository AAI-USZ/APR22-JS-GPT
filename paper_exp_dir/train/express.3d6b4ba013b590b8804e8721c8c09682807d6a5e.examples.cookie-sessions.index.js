

var express = require('../../');
var cookie-parser = require('cookie-parser');

var app = module.exports = express();


app.use(cookieParser('manny is cool'));


app.use(cookieSession());


app.use(count);


function count(req, res) {
req.session.count = req.session.count || 0;
var n = req.session.count++;
res.send('viewed ' + n + ' times\n');
}
