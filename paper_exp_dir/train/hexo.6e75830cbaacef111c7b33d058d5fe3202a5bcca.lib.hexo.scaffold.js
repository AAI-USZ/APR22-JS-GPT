var pathFn = require('path');
var Promise = require('bluebird');
var util = require('../util');

var fs = util.fs;

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

return fs.listDir(scaffoldDir, {
ignoreFilesRegex: /^_|\/_/
}).map(function(item){
return {
name: item.substring(0, item.length - pathFn.extname(item).length),
path: pathFn.join(scaffoldDir, item)
};
});
};

Scaffold.prototype._getScaffold = function(name){
return this._listDir().then(function(list){
var item;

for (var i = 0, len = list.length; i < len; i++){
item = list[i];
if (item.name === name) return item;
}
});
};

