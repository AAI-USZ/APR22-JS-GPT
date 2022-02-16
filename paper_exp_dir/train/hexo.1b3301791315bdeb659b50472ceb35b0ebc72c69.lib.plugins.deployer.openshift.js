var colors = require('colors'),
path = require('path'),
moment = require('moment'),
spawn = require('child_process').spawn,
util = require('../../util'),
file = util.file2,
commitMessage = require('./util').commitMessage,
async = require('async'),
fs = require('graceful-fs');


var run = function(command, args, callback){
var cp = spawn(command, args);

cp.stdout.on('data', function(data){
process.stdout.write(data);
