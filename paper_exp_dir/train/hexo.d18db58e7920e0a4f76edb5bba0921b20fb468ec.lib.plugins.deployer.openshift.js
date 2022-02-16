var colors = require('colors'),
path = require('path'),
moment = require('moment'),
spawn = require('child_process').spawn,
util = require('../../util'),
file = util.file2,
commitMessage = require('./util').commitMessage;
async = require('async');

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
var baseDir = hexo.base_dir,
publicDir = hexo.public_dir;

if (!args.remote){
var help = '';

help += 'You should configure deployment settings in _config.yml first!\n\n';
help += 'Example:\n';
help += '  deploy:\n';
help += '    type: openshift\n';
help += '    root:<root directory>\n';
help += '    remote: <upstream git remote>\n';
help += '    branch: [upstraem git branch] # Default is master\n';
help += '    message: [message]\n\n';
help += 'For more help, you can check the docs: ' + 'http://hexo.io/docs/deployment.html'.underline;

console.log(help);
return callback();
}

