

var express = require('../..');
var User = require('./user');
var app = express();

app.set('views', __dirname);
app.set('view engine', 'jade');



function ferrets(user) {
return user.species == 'ferret';
