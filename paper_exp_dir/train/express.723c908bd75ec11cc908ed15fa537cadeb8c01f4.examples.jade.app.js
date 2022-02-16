

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express');



var pub = __dirname + '/public';




var app = express.createServer(
express.compiler({ src: pub, enable: ['sass'] })
, express.static(pub)
);



app.set('views', __dirname + '/views');




app.set('view engine', 'jade');

function User(name, email) {
this.name = name;
this.email = email;
}


var users = [
new User('tj', 'tj@vision-media.ca')
, new User('ciaran', 'ciaranj@gmail.com')
, new User('aaron', 'aaron.heckmann+github@gmail.com')
];

app.get('/', function(req, res){
res.render('users', { users: users });
});

app.get('/users/callback', function(req, res){

res.partial('users/user', users, function(err, html){
if (err) throw err;
console.log(html);
res.send(html);
});
});

app.get('/users', function(req, res){



res.partial('users/user', users);
