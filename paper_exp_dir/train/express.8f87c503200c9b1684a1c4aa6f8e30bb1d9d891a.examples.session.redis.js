


var express = require('../../lib/express');



var RedisStore = require('connect-redis')(express);

var app = express.createServer();

app.use(express.favicon());


app.use(express.logger());


app.use(express.cookieParser());


