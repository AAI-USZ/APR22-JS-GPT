var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
colors = require('colors'),
moment = require('moment'),
spawn = require('child_process').spawn,
util = require('../../../util'),
file = util.file2;

module.exports = function(args, callback){
if (!args.repo && !args.repository){
var help = [
'You should configure deployment settings in _config.yml first!',
'',
'Example:',
'  deploy:',
'    type: heroku',
'    repository: <repository url>',
'',
'For more help, you can check the docs: ' + 'http://zespia.tw/hexo/docs/deployment.html'.underline
