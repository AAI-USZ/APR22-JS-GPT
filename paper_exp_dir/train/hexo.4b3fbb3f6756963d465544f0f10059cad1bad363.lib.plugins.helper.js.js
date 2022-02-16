var extend = require('../../extend'),
_ = require('lodash'),
root = hexo.config.root;

extend.helper.register('js', function(){
var out = [];

_.toArray(arguments).forEach(function(path){
if (!Array.isArray(path)) path = [path];

path.forEach(function(item){
