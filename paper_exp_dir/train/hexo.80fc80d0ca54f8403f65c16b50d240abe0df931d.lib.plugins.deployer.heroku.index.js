var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
colors = require('colors'),
spawn = require('child_process').spawn,
util = require('../../../util'),
file = util.file2,
commitMessage = require('../util').commitMessage;

module.exports = function(args, callback){
if (!args.repo && !args.repository){
var help = '';

help += 'You should configure deployment settings in _config.yml first!\n\n';
help += 'Example:\n';
help += '  deploy:\n';
help += '    type: heroku\n';
help += '    repo: <repository url>\n';
help += '    message: [message]\n\n';
help += 'For more help, you can check the docs: ' + 'http://hexo.io/docs/deployment.html'.underline;

