

var express = require('../..');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var app = module.exports = express();





app.set('view engine', 'jade');


app.set('views', __dirname + '/views');



app.response.message = function(msg){

var sess = this.req.session;

sess.messages = sess.messages || [];
sess.messages.push(msg);
return this;
};


if (!module.parent) app.use(logger('dev'));


app.use(express.static(__dirname + '/public'));


app.use(cookieParser('some secret here'));
app.use(session());


app.use(bodyParser());


app.use(methodOverride('_method'));


app.use(function(req, res, next){
var msgs = req.session.messages || [];


res.locals.messages = msgs;


res.locals.hasMessages = !! msgs.length;



next();


req.session.messages = [];
});


require('./lib/boot')(app, { verbose: !module.parent });

app.use(function(err, req, res, next){

if (!module.parent) console.error(err.stack);


res.status(500).render('5xx');
});


app.use(function(req, res, next){
res.status(404).render('404', { url: req.originalUrl });
});


