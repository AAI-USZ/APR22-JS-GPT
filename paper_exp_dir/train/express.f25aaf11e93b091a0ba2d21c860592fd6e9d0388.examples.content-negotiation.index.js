
var express = require('../../')
, app = module.exports = express()
, users = require('./db');

app.get('/', function(req, res){
res.format({
html: function(){
res.send('<ul>' + users.map(function(user){
return '<li>' + user.name + '</li>';
}).join('') + '</ul>');
},
