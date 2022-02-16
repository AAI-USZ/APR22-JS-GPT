


var express = require('../../lib/express')
, hash = require('./pass').hash;

var app = module.exports = express();

app.use(express.bodyParser());
app.use(express.cookieParser('shhhh, very secret'));
app.use(express.session());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



app.locals.use(function(req,res){
var err = req.session.error
, msg = req.session.success;
delete req.session.error;
delete req.session.success;
res.locals.message = '';
if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
})



var users = {
tj: { name: 'tj' }
};




hash('foobar', function(err, salt, hash){
if (err) throw err;
