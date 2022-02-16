var async = require('async'),
_ = require('underscore'),
extend = require('./extend'),
processor = extend.processor.list(),
util = require('./util'),
file = util.file,
sourceDir = hexo.source_dir;

module.exports = function(files, callback){
if (!_.isArray(files)) files = [files];

hexo.emit('processBefore');

async.forEach(files, function(item, next){
var tasks = [];

processor.forEach(function(item){
var rule = item.rule,
match = false,
params;

if (_.isRegExp(rule)){
var exec = rule.exec(item);
if (exec){
