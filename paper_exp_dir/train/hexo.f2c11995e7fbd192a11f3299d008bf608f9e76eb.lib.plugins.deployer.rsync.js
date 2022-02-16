var colors = require('colors'),
spawn = require('child_process').spawn;

var run = function(command, args, callback){
var cp = spawn(command, args);

cp.stdout.on('data', function(data){
process.stdout.write(data);
});

cp.stderr.on('data', function(data){
process.stderr.write(data);
});
