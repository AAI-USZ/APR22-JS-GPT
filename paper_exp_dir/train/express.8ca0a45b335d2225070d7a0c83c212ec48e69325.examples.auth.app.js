


var express = require('../../lib/express')
, crypto = require('crypto');

var app = express.createServer(
express.bodyParser()
, express.cookieParser()
, express.session({ secret: 'keyboard cat' })
);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');




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

