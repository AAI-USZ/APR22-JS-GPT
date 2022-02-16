var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
colors = require('colors'),
moment = require('moment'),
spawn = require('child_process').spawn,
util = require('../../../util'),
file = util.file2;

module.exports = function(args, callback){
var config = hexo.config.deploy,
baseDir = hexo.base_dir;

if (!config.repo && !config.repository){
var help = [
'You should configure deployment settings in _config.yml first!',
'',
'Example:',
'  deploy:',
