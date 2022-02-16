


var express = require('../../lib/express')
, hash = require('./pass').hash;

var app = module.exports = express();



app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



app.use(express.bodyParser());
app.use(express.cookieParser('shhhh, very secret'));
app.use(express.session());

