

var express = require('../..');
var logger = require('morgan');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var app = module.exports = express();



app.set('view engine', 'ejs');


app.set('views', path.join(__dirname, 'views'));



app.response.message = function(msg){

var sess = this.req.session;

sess.messages = sess.messages || [];
sess.messages.push(msg);
return this;
};
