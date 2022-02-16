var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
colors = require('colors'),
spawn = require('child_process').spawn,
util = require('../../../util'),
file = util.file2,
commitMessage = require('../../util').commitMessage;

module.exports = function(args, callback){
if (!args.repo && !args.repository){
var help = [
'You should configure deployment settings in _config.yml first!',
'',
'Example:',
'  deploy:',
'    type: heroku',
'    repo: <repository url>',
'    message: [message]',
'',
'For more help, you can check the docs: ' + 'http://hexo.io/docs/deployment.html'.underline
];

console.log(help.join('\n'));
