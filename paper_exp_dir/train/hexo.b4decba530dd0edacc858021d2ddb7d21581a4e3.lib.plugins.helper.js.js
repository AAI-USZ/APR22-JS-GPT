var extend = require('../../extend'),
root = hexo.config.root;

extend.helper.register('js', function(path){
if (!Array.isArray) path = [path];

var result = [];

path.forEach(function(item){
if (item.substr(item.length - 3, 3) !== '.js') item += '.js';
