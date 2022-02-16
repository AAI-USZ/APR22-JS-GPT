var Hexo = require('../hexo');
var pathFn = require('path');
var fs = require('hexo-fs');

var cwd = process.cwd();
var lastCwd = cwd;

require('colors');


function findConfigFile(){

return fs.exists(pathFn.join(cwd, '_config.yml')).then(function(exist){
if (exist) return;

lastCwd = cwd;
cwd = pathFn.dirname(cwd);


if (lastCwd === cwd) return;

return findConfigFile();
});
}

module.exports = function(args){
var hexo;

findConfigFile().then(function(){

if (cwd === lastCwd){
hexo = new Hexo(process.cwd(), args);
} else {
hexo = new Hexo(cwd, args);
}

return hexo.init();
}).then(function(){
var command = args._.shift();

if (command){
var c = hexo.extend.console.get(command);

if (!c || (!hexo.env.init && !c.options.init)){
command = 'help';
}
