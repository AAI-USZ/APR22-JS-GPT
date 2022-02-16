'use strict';

const { dirname, extname, join } = require('path');
const assignIn = require('lodash/assignIn');
const yfm = require('hexo-front-matter');
const Promise = require('bluebird');

function View(path, data) {
this.path = path;
this.source = join(this._theme.base, 'layout', path);
this.data = typeof data === 'string' ? yfm(data) : data;

this._precompile();
}
