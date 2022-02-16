var async = require('async'),
fs = require('graceful-fs'),
colors = require('colors');

var log = hexo.log,
extend = hexo.extend,
deployer = extend.deployer.list();

module.exports = function(args, callback){
var config = hexo.config.deploy;

if (!config || !config.type){
var help = [
'You should configure deployment settings in _config.yml first!',
