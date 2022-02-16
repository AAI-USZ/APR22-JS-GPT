var async = require('async'),
fs = require('graceful-fs'),
colors = require('colors'),
_ = require('lodash');

module.exports = function(args, callback){
var config = hexo.config.deploy,
log = hexo.log,
extend = hexo.extend,
deployer = extend.deployer.list();

if (!config || !config.type){
