var paginator = require('./paginator'),
extend = require('../extend'),
route = require('../route');

extend.generator.register(function(locals, render, callback){
var config = hexo.config.category;

if (!config) return callback();

locals.tags.each(function(item){
var path = item.path;
item.category = item.name;

