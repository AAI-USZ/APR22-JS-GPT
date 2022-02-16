

var express = require('../../..');
var fs = require('fs');
var path = require('path');

module.exports = function(parent, options){
var dir = path.join(__dirname, '..', 'controllers');
var verbose = options.verbose;
fs.readdirSync(dir).forEach(function(name){
var file = path.join(dir, name)
if (!fs.statSync(file).isDirectory()) return;
verbose && console.log('\n   %s:', name);
var obj = require(file);
