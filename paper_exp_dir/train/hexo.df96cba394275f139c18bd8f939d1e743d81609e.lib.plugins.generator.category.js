var paginator = require('./paginator');

var config = hexo.config;

module.exports = function(locals, render, callback){
if (config.exclude_generator && config.exclude_generator.indexOf('category') > -1) return callback();

var mode = config.category;

if (!mode){
