

var cookieSession = require('cookie-session');
var express = require('../../');

var app = module.exports = express();


app.use(cookieSession({ secret: 'manny is cool' }));


app.use(count);


function count(req, res) {
