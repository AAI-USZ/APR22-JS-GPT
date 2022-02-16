


var express = require('../../lib/express');

var app = express.createServer();


app.register('.html', require('ejs'));

require('./mvc').boot(app);
