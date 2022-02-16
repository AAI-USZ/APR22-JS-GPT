
var express = require('../../')
, app = module.exports = express();

var users = [];

users.push({ name: 'Tobi' });
users.push({ name: 'Loki' });
users.push({ name: 'Jane' });

app.get('/', function(req, res){
res.respondTo({
