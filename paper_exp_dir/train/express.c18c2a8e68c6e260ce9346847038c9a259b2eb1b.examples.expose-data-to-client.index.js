
var express = require('../..')
, app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

function User(name) {
this.private = 'heyyyy';
this.secret = 'something';
this.name = name;
this.id = 123;
}





User.prototype.toJSON = function(){
return {
id: this.id,
name: this.name
}
};

app.use(express.logger('dev'));







app.use(function(req, res, next){
res.locals.expose = {};


next();
});



app.use(function(req, res, next){
req.user = new User('Tobi');
next();
});

app.get('/', function(req, res){
res.redirect('/user');
});

app.get('/user', function(req, res){


res.locals.expose.user = req.user;
res.render('page');
});


if (!module.parent) {
