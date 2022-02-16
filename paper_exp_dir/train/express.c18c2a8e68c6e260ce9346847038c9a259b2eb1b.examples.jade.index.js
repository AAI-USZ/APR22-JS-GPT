


var express = require('../../lib/express');



var pub = __dirname + '/public';



var app = express();
app.use(app.router);
app.use(express.static(pub));
app.use(express.errorHandler());



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


if (!module.parent) {
