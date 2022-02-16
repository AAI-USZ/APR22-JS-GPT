

var express = require('../..');
var hash = require('./pass').hash;
var bodyParser = require('body-parser');
var session = require('express-session');

var app = module.exports = express();



app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
resave: false,
saveUninitialized: false,
secret: 'shhhh, very secret'
}));



app.use(function(req, res, next){
var err = req.session.error;
var msg = req.session.success;
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
});
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
res.redirect('/login');
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
res.render('login');
});

app.post('/login', function(req, res){
authenticate(req.body.username, req.body.password, function(err, user){
if (user) {


req.session.regenerate(function(){



req.session.user = user;
req.session.success = 'Authenticated as ' + user.name
+ ' click to <a href="/logout">logout</a>. '
+ ' You may now access <a href="/restricted">/restricted</a>.';
res.redirect('back');
});
} else {
req.session.error = 'Authentication failed, please check your '
+ ' username and password.'
+ ' (use "tj" and "foobar")';
res.redirect('/login');
}
});
});


if (!module.parent) {
app.listen(3000);
console.log('Express started on port 3000');
}
