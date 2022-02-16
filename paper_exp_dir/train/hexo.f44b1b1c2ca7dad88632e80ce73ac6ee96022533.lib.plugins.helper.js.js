module.exports = function(path){
var args = Array.prototype.slice.call(arguments),
root = hexo.config.root,
out = [];

args.forEach(function(path){
if (!Array.isArray(path)) path = [path];

path.forEach(function(item){
if (item.substr(item.length - 3, 3) !== '.js') item += '.js';
