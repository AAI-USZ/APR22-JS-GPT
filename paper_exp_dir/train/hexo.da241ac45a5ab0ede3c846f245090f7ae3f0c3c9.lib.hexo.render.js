'use strict';

var pathFn = require('path');
var Promise = require('bluebird');
var fs = require('hexo-fs');

function getExtname(str) {
var extname = pathFn.extname(str);
return extname[0] === '.' ? extname.slice(1) : extname;
}

function Render(ctx) {
this.context = ctx;
this.renderer = ctx.extend.renderer;
}

Render.prototype.isRenderable = function(path) {
return this.renderer.isRenderable(path);
};

Render.prototype.isRenderableSync = function(path) {
return this.renderer.isRenderableSync(path);
};

Render.prototype.getOutput = function(path) {
return this.renderer.getOutput(path);
};

Render.prototype.getRenderer = function(ext, sync) {
return this.renderer.get(ext, sync);
};

Render.prototype.getRendererSync = function(ext) {
return this.getRenderer(ext, true);
};

Render.prototype.render = function(data, options, callback) {
if (!callback && typeof options === 'function') {
