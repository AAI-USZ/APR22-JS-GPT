

var spawn = require('child_process').spawn;



module.exports = function(options){
var comm = spawn(options.command, options.args, options.options);

comm.stdout.setEncoding('utf8');
comm.stderr.setEncoding('utf8');

