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

cp.on('close', callback);
};

module.exports = function(args, callback){
if (!args.host || !args.user || !args.root){
var help = [
'You should configure deployment settings in _config.yml first!',
'',
'Example:',
'  deploy:',
'    type: rsync',
'    host: <host>',
'    user: <user>',
'    root: <root>',
