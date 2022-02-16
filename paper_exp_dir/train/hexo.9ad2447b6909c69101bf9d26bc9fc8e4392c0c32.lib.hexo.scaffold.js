var pathFn = require('path');
var Promise = require('bluebird');
var fs = require('hexo-fs');

function Scaffold(context){
this.context = context;
this.scaffoldDir = context.scaffold_dir;
this.assetDir = pathFn.join(context.core_dir, 'assets', 'scaffolds');
}

Scaffold.prototype.defaults = {
normal: [
'layout: {{ layout }}',
'title: {{ title }}',
'date: {{ date }}',
'tags:',
'---'
].join('\n')
};

Scaffold.prototype._listDir = function(){
var scaffoldDir = this.scaffoldDir;

return fs.exists(scaffoldDir).then(function(exist){
if (!exist) return [];

return fs.listDir(scaffoldDir, {
ignoreFilesRegex: /^_|\/_/
});
}).map(function(item){
return {
name: item.substring(0, item.length - pathFn.extname(item).length),
path: pathFn.join(scaffoldDir, item)
