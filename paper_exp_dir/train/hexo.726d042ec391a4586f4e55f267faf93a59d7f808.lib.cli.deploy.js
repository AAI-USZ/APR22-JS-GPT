var async = require('async'),
clc = require('cli-color'),
util = require('../util'),
log = util.log,
spawn = util.spawn;

var command = function(command, callback){
spawn(command,
function(data){
log.info(data);
},
