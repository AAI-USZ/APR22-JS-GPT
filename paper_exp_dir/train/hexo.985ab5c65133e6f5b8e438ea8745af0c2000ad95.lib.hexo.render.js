'use strict';

const pathFn = require('path');
const Promise = require('bluebird');
const fs = require('hexo-fs');

function getExtname(str) {
if (typeof str !== 'string') return '';

const extname = pathFn.extname(str);
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
callback = options;
options = {};
}

const ctx = this.context;
let ext = '';

return new Promise((resolve, reject) => {
if (!data) return reject(new TypeError('No input file or string!'));
if (data.text != null) return resolve(data.text);
if (!data.path) return reject(new TypeError('No input file or string!'));

fs.readFile(data.path).then(resolve, reject);
}).then(text => {
data.text = text;
