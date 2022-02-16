'use strict';

var pathFn = require('path');
var _ = require('lodash');
var yfm = require('hexo-front-matter');

function View(path, data){
this.path = path;
this.source = pathFn.join(this._theme.base, 'layout', path);
this.data = typeof data === 'string' ? yfm(data) : data;
