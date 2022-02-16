

var express = require('../..')
, hash = require('./pass').hash;

var app = module.exports = express();



app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



app.use(express.bodyParser());
app.use(express.cookieParser('shhhh, very secret'));
app.use(express.session());



app.use(function(req, res, next){
var err = req.session.error
, msg = req.session.success;
delete req.session.error;
delete req.session.success;
res.locals.message = '';
if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
next();
});



var users = {
tj: { name: 'tj' }
};




hash('foobar', function(err, salt, hash){
if (err) throw err;

users.tj.salt = salt;
users.tj.hash = hash;
});




function authenticate(name, pass, fn) {
if (!module.parent) console.log('authenticating %s:%s', name, pass);
var user = users[name];

if (!user) return fn(new Error('cannot find user'));



hash(pass, user.salt, function(err, hash){
if (err) return fn(err);
