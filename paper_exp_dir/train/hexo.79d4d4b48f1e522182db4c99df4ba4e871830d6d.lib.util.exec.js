

var exec = require('child_process').exec;



module.exports = function(options){
var comm = exec(options.command, options.options, options.callback);

comm.stdout.setEncoding('utf8');
comm.stderr.setEncoding('utf8');

