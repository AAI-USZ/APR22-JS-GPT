var async = require('async'),
fs = require('fs'),
path = require('path'),
moment = require('moment'),
spawn = require('child_process').spawn,
util = require('../../util'),
file = util.file2,
commitMessage = require('./util').commitMessage;

module.exports = function(args, callback){
var baseDir = args.deploy_dir || hexo.base_dir,
deployDir = path.join(baseDir, '.deploy'),
publicDir = hexo.public_dir;

if (!args.repo && !args.repository){
