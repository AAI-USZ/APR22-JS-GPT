

var express = require('../..');



var RedisStore = require('connect-redis')(express);

var app = express();

app.use(express.logger('dev'));




app.use(express.cookieParser('keyboard cat'));
