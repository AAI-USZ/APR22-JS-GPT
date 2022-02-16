

var express = require('../../..');
var fs = require('fs');

module.exports = function(parent, options){
var verbose = options.verbose;
fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
if (!fs.statSync(__dirname + '/../controllers/' + name).isDirectory()) return;
verbose && console.log('\n   %s:', name);
var obj = require('./../controllers/' + name);
var name = obj.name || name;
var prefix = obj.prefix || '';
var app = express();
var handler;
var method;
var path;


