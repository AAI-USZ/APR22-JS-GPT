var pathFn = require('path');
var _ = require('lodash');
var yfm = require('hexo-front-matter');

function View(path, data){
var ctx = this.context;

this.path = path;
this.source = pathFn.join(this.theme.base, path);
this.extname = pathFn.extname(path);
this.render = ctx.render;
this.helper = ctx.extend.helper;
this.data = typeof data === 'string' ? yfm(data) : data;
