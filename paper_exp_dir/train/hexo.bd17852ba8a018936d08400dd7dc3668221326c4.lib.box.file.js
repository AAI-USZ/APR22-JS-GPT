var fs = require('hexo-fs');

function File(data){
this.source = data.source;
this.path = data.path;
this.type = data.type;
this.params = data.params;

if (this._context){
this._render = this._context.render;
