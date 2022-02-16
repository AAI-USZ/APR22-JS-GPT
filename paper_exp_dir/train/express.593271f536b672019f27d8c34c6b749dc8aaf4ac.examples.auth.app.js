


var express = require('../../lib/express')
, crypto = require('crypto');

var app = module.exports = express();

app.use(express.bodyParser());
app.use(express.cookieParser('shhhh, very secret'));
app.use(express.session());

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
tj: {
name: 'tj'
, salt: 'randomly-generated-salt'
, pass: hash('foobar', 'randomly-generated-salt')
}
};


function hash(msg, key) {
return crypto.createHmac('sha256', key).update(msg).digest('hex');
}


function authenticate(name, pass, fn) {
var user = users[name];

if (!user) return fn(new Error('cannot find user'));



if (user.pass == hash(pass, user.salt)) return fn(null, user);

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

app.get('/', function(req, res){
res.redirect('login');
});

app.get('/restricted', restrict, function(req, res){
res.send('Wahoo! restricted area');
});

app.get('/logout', function(req, res){


