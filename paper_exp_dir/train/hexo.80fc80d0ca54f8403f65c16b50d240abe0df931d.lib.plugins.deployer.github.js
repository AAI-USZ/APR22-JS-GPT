var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
colors = require('colors'),
swig = require('swig'),
spawn = require('child_process').spawn,
util = require('../../util'),
file = util.file2,
commitMessage = require('./util').commitMessage;


var rRepo = /(:|\/)([^\/]+)\/([^\/]+)\.git\/?$/;

module.exports = function(args, callback){
var baseDir = hexo.base_dir,
deployDir = path.join(baseDir, '.deploy'),
publicDir = hexo.public_dir;

if (!args.repo && !args.repository){
var help = '';

help += 'You should configure deployment settings in _config.yml first!\n\n';
help += 'Example:\n';
help += '  deploy:\n';
help += '    type: github\n';
help += '    repo: <repository url>\n';
help += '    branch: [branch]\n';
help += '    message: [message]\n\n';
help += 'For more help, you can check the docs: ' + 'http://hexo.io/docs/deployment.html'.underline;
