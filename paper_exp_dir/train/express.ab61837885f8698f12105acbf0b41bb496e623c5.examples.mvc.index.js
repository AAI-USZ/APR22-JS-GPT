
var express = require('../..');

var app = module.exports = express();




app.engine('html', require('ejs').renderFile);


app.set('view engine', 'html');


app.set('views', __dirname + '/views');



app.response.message = function(msg){

var sess = this.req.session;

sess.messages = sess.messages || [];
sess.messages.push(msg);
return this;
};


if (!module.parent) app.use(express.logger('dev'));


app.use(express.static(__dirname + '/public'));


app.use(express.cookieParser('some secret here'));
app.use(express.session());


app.use(express.bodyParser());


app.use(express.methodOverride());


app.use(function(req, res, next){
