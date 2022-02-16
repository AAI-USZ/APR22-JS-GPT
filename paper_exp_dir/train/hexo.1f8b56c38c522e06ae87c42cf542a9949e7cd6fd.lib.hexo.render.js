var pathFn = require('path');
var Promise = require('bluebird');
var fs = require('hexo-fs');

function getExtname(str){
var extname = pathFn.extname(str);
return extname[0] === '.' ? extname.slice(1) : extname;
}

function Render(ctx){
this.context = ctx;
this.renderer = ctx.extend.renderer;
}

Render.prototype.isRenderable = function(path){
return this.renderer.isRenderable(path);
};

Render.prototype.isRenderableSync = function(path){
return this.renderer.isRenderableSync(path);
};

Render.prototype.getOutput = function(path){
return this.renderer.getOutput(path);
};

Render.prototype.render = function(data, options, callback){
if (!callback && typeof options === 'function'){
callback = options;
options = {};
}

var ctx = this.context;
var self = this;
var ext = '';

return new Promise(function(resolve, reject){
if (!data) return reject(new TypeError('No input file or string!'));
if (data.text != null) return resolve(data.text);
if (!data.path) return reject(new TypeError('No input file or string!'));

fs.readFile(data.path).then(resolve, reject);
}).then(function(text){
data.text = text;
