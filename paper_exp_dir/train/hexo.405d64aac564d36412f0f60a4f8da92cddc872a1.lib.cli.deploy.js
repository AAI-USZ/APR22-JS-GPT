var async = require('async'),
clc = require('cli-color'),
moment = require('moment'),
rimraf = require('rimraf'),
util = require('../util'),
file = util.file,
log = util.log,
spawn = util.spawn;

var command = function(command, callback){
spawn(command,
function(data){
log.info(data);
