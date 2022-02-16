

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express')
, crypto = require('crypto');

var app = express.createServer();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.bodyDecoder());
app.use(express.cookieDecoder());
app.use(express.session({ secret: 'keyboard cat' }));




app.dynamicHelpers({
message: function(req){
var err = req.session.error
, msg = req.session.success;
delete req.session.error;
delete req.session.success;
if (err) return '<p class="msg error">' + err + '</p>';
if (msg) return '<p class="msg success">' + msg + '</p>';
}
});



var users = {
tj: {
name: 'tj'
, salt: 'randomly-generated-salt'
, pass: md5('foobar' + 'randomly-generated-salt')
}
};



function md5(str) {
return crypto.createHash('md5').update(str).digest('hex');
}



function authenticate(name, pass, fn) {
var user = users[name];

if (!user) return fn(new Error('cannot find user'));



if (user.pass == md5(pass + user.salt)) return fn(null, user);

fn(new Error('invalid password'));
}

function restrict(req, res, next) {
if (req.session.user) {
next();
} else {
req.session.error = 'Access denied!';
res.redirect('/login');
}
}

function accessLogger(req, res, next) {
console.log('/restricted accessed by %s', req.session.user.name);
next();
}

app.get('/', function(req, res){
res.redirect('/login');
});

app.get('/restricted', restrict, accessLogger, function(req, res){
res.send('Wahoo! restricted area');
});

app.get('/logout', function(req, res){


req.session.destroy(function(){
res.redirect('home');
});
});

app.get('/login', function(req, res){
if (req.session.user) {
req.session.success = 'Authenticated as ' + req.session.user.name
+ ' click to <a href="/logout">logout</a>. '
+ ' You may now access <a href="/restricted">/restricted</a>.';
}
res.render('login');
});

app.post('/login', function(req, res){
authenticate(req.body.username, req.body.password, function(err, user){
if (user) {


req.session.regenerate(function(){



req.session.user = user;
res.redirect('back');
});
} else {
req.session.error = 'Authentication failed, please check your '
+ ' username and password.'
+ ' (use "tj" and "foobar")';
res.redirect('back');
}
});
});

app.listen(3000);
console.log('Express started on port 3000');
