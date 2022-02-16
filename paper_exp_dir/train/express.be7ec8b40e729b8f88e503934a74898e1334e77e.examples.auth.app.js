

var express = require('../..')
, hash = require('./pass').hash;

var app = express();



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
if (hash == user.hash) return fn(null, user);
fn(new Error('invalid password'));
})
}

function restrict(req, res, next) {
if (req.session.user) {
next();
} else {
req.session.error = 'Access denied!';
res.redirect('/login');
}
}

app.get('/', function(req, res){
res.redirect('login');
});

app.get('/restricted', restrict, function(req, res){
res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.get('/logout', function(req, res){


req.session.destroy(function(){
res.redirect('/');
});
});

app.get('/login', function(req, res){
res.render('login', {
title: "Authentication Example",
user: req.session.user ? req.session.user.name : undefined
});
});

app.post('/login', function(req, res){
authenticate(req.body.username, req.body.password, function(err, user){
if (user) {


req.session.regenerate(function(){
