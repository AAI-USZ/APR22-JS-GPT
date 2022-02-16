var async = require('async'),
clc = require('cli-color'),
fs = require('fs'),
moment = require('moment'),
rimraf = require('rimraf'),
util = require('../util'),
file = util.file,
spawn = util.spawn;

var command = function(command, sub, options, callback){
spawn(command, sub, options,
function(data){
console.log(data);
},
function(data){
console.log(data);
},
