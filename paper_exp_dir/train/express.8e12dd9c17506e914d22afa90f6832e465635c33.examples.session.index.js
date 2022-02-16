




var express = require('../..');

var app = express();

app.use(express.logger('dev'));




app.use(express.cookieParser('keyboard cat'));


