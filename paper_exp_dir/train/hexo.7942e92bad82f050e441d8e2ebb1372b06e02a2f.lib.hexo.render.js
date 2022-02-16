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
