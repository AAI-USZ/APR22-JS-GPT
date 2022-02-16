var extend = require('../../extend'),
route = require('../../route'),
paginator = require('./paginator');

extend.generator.register(function(locals, render, callback){
var config = hexo.config.tag;

if (!config) return callback();

