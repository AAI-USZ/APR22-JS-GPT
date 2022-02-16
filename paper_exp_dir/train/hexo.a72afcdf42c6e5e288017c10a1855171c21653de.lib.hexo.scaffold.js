'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');

function Scaffold(context) {
this.context = context;
this.scaffoldDir = context.scaffold_dir;
}

Scaffold.prototype.defaults = {
normal: [
'---',
'layout: {{ layout }}',
'title: {{ title }}',
'date: {{ date }}',
'tags:',
'---'
].join('\n')
};

Scaffold.prototype._listDir = function() {
const scaffoldDir = this.scaffoldDir;

return fs.exists(scaffoldDir).then(exist => {
if (!exist) return [];

return fs.listDir(scaffoldDir, {
ignoreFilesRegex: /^_|\/_/
});
}).map(item => ({
name: item.substring(0, item.length - pathFn.extname(item).length),
path: pathFn.join(scaffoldDir, item)
}));
};

Scaffold.prototype._getScaffold = function(name) {
return this._listDir().then(list => list.find(item => item.name === name));
};

Scaffold.prototype.get = function(name, callback) {
const self = this;

return this._getScaffold(name).then(item => {
if (item) {
return fs.readFile(item.path);
}

