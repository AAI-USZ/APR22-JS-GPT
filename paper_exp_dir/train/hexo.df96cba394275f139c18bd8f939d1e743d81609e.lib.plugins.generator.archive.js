var paginator = require('./paginator'),
_ = require('lodash');

var config = hexo.config;

module.exports = function(locals, render, callback){
if (config.exclude_generator && config.exclude_generator.indexOf('archive') > -1) return callback();

var mode = config.archive,
archiveDir = config.archive_dir + '/';

