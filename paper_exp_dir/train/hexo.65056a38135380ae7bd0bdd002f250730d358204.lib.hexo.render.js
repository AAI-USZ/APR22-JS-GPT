'use strict';

const { extname } = require('path');
const Promise = require('bluebird');
const fs = require('hexo-fs');

function getExtname(str) {
if (typeof str !== 'string') return '';

const ext = extname(str);
return ext[0] === '.' ? ext.slice(1) : ext;
}

class Render {
constructor(ctx) {
this.context = ctx;
this.renderer = ctx.extend.renderer;
}

isRenderable(path) {
return this.renderer.isRenderable(path);
}

