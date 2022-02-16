var extend = require('../../extend'),
root = hexo.config.root;

extend.helper.register('css', function(path){
if (!Array.isArray) path = [path];

var result = [];

path.forEach(function(item){
if (item.substr(item.length - 4, 4) !== '.css') item += '.css';
