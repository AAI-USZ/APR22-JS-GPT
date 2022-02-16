

var express = require('../../..');
var fs = require('fs');

module.exports = function(parent, options){
var verbose = options.verbose;
fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
verbose && console.log('\n   %s:', name);
var obj = require('./../controllers/' + name);
var name = obj.name || name;
var prefix = obj.prefix || '';
var app = express();
var handler;
var method;
var path;


if (obj.engine) app.set('view engine', obj.engine);
app.set('views', __dirname + '/../controllers/' + name + '/views');



for (var key in obj) {

