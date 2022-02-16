'use strict';

var pathFn = require('path');
var Promise = require('bluebird');
var fs = require('hexo-fs');

function getExtname(str) {
if (typeof str !== 'string') return '';

var extname = pathFn.extname(str);
return extname[0] === '.' ? extname.slice(1) : extname;
}

function Render(ctx) {
this.context = ctx;
this.renderer = ctx.extend.renderer;
}
