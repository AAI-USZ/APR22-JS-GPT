var colors = require('colors'),
spawn = require('child_process').spawn;

var log = hexo.log;

var run = function(command, args, callback){
var cp = spawn(command, args);

cp.stdout.on('data', function(data){
log.i(data);
