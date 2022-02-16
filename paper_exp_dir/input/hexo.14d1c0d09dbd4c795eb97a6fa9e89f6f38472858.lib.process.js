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
file.read(sourceDir + item, function(err, content){
if (err) throw new Error('Failed to read file: ' + sourceDir + item);

