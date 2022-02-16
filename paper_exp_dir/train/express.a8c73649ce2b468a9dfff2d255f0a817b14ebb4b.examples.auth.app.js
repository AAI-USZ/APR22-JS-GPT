


var express = require('../../lib/express')
, crypto = require('crypto');

var app = module.exports = express()

app.use(express.bodyParser())
app.use(express.cookieParser('shhhh, very secret'))
app.use(express.session({ secret: 'keyboard cat' }))

app.set('views', __dirname + '/views');



app.locals.use(function(req,res){
var err = req.session.error
, msg = req.session.success;
delete req.session.error;
