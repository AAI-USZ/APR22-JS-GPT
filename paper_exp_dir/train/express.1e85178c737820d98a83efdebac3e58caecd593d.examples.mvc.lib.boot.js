
var express = require('../../..')
, fs = require('fs');

module.exports = function(parent, options){
var verbose = options.verbose;
verbose && console.log();
fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
verbose && console.log('   %s:', name);
var obj = require('./../controllers/' + name)
, name = obj.name || name
, prefix = obj.prefix || ''
, app = express()
, method
