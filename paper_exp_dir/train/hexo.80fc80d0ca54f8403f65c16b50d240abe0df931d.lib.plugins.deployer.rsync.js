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
var help = '';

help += 'You should configure deployment settings in _config.yml first!\n\n';
help += 'Example:\n';
help += '  deploy:\n';
help += '    type: rsync\n';
help += '    host: <host>\n';
help += '    user: <user>\n';
help += '    root: <root>\n';
help += '    port: [port] # Default is 22\n';
