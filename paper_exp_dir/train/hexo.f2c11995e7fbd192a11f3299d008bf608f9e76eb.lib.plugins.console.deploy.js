var async = require('async'),
fs = require('graceful-fs'),
colors = require('colors');

module.exports = function(args, callback){
var config = hexo.config.deploy,
log = hexo.log,
extend = hexo.extend,
deployer = extend.deployer.list();

if (!config || !config.type){
var help = [
'You should configure deployment settings in _config.yml first!',
'',
