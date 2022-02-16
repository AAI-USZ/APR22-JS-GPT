

var express = require('../..');
var logger = require('morgan');
var session = require('express-session');
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


app.use(session({
resave: false,
saveUninitialized: false,
secret: 'some secret here'
}));


app.use(bodyParser.urlencoded({ extended: true }));


app.use(methodOverride('_method'));


app.use(function(req, res, next){
