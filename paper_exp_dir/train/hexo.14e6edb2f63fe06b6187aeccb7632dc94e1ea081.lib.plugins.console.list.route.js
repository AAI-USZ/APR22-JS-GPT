var colors = require('colors');

module.exports = function(args, callback){
var keys = Object.keys(hexo.route.routes);

if (args.json){
console.log(keys);
return callback();
}

var routes = {};

keys.forEach(function(key){
