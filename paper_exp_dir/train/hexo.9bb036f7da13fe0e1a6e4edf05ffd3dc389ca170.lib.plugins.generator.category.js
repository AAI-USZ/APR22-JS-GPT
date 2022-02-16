var extend = require('../../extend'),
paginator = require('./paginator');

extend.generator.register(function(locals, render, callback){
var config = hexo.config.category;

if (!config){
if (config == 0 || config === false){
return callback();
} else {
config = 2;
