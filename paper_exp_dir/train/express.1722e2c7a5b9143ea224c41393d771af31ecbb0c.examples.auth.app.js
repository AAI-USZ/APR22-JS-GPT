

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express'),
crypto = require('crypto');

var app = express.createServer();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.bodyDecoder());
app.use(express.cookieDecoder());
app.use(express.session());




app.dynamicHelpers({
message: function(req){
var err = req.session.error,
msg = req.session.success;
delete req.session.error;
delete req.session.success;
if (err) return '<p class="msg error">' + err + '</p>';
if (msg) return '<p class="msg success">' + msg + '</p>';
}
});



var users = {
tj: {
name: 'tj',
salt: 'randomly-generated-salt',
pass: md5('foobar' + 'randomly-generated-salt')
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
