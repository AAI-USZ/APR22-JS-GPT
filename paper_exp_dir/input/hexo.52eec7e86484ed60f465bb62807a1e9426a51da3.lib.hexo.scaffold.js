'use strict';

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
const { scaffoldDir } = this;

return fs.exists(scaffoldDir).then(exist => {
if (!exist) return [];

return fs.listDir(scaffoldDir, {
ignoreFilesRegex: /^_|\/_/
});
}).map(item => ({
