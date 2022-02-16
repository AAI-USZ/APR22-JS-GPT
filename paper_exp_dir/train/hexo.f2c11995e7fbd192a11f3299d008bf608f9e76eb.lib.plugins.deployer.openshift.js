var colors = require('colors'),
path = require('path'),
moment = require('moment'),
spawn = require('child_process').spawn,
util = require('../../util'),
file = util.file2;

var run = function(command, args, callback){
var cp = spawn(command, args);

cp.stdout.on('data', function(data){
process.stdout.write(data);
});

cp.stderr.on('data', function(data){
process.stderr.write(data);
});

cp.on('close', callback);
};
