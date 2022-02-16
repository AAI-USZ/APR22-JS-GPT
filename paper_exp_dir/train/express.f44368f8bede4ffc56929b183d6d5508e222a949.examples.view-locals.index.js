

var express = require('../..');
var path = require('path');
var User = require('./user');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



function ferrets(user) {
return user.species == 'ferret';
}
