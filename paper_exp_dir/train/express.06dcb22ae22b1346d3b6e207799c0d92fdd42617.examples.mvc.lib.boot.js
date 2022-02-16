

var express = require('../../..');
var fs = require('fs');

module.exports = function(parent, options){
var verbose = options.verbose;
fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
verbose && console.log('\n   %s:', name);
var obj = require('./../controllers/' + name);
var name = obj.name || name;
