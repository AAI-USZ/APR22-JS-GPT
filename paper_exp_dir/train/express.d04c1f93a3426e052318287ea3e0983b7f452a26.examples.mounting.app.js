

var express = require('../../lib/express')
, blog = require('../blog/app');

var app = express.createServer();

app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));




app.use('/blog', blog);

