

var express = require('../../');

var app = module.exports = express();


app.use(cookieSession({ secret: 'manny is cool' }));


app.use(count);


function count(req, res) {
req.session.count = req.session.count || 0;
var n = req.session.count++;
