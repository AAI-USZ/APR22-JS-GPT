var _ = require('lodash'),
paginator = require('./paginator');

module.exports = function(locals, render, callback){
var config = hexo.config;

if (config.exclude_generator && config.exclude_generator.indexOf('category') > -1) return callback();


