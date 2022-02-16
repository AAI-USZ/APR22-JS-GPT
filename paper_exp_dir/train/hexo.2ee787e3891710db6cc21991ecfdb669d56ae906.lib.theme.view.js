'use strict';

const pathFn = require('path');
const _ = require('lodash');
const yfm = require('hexo-front-matter');
const Promise = require('bluebird');

function View(path, data) {
this.path = path;
this.source = pathFn.join(this._theme.base, 'layout', path);
this.data = typeof data === 'string' ? yfm(data) : data;

this._precompile();
}

View.prototype.render = function(options, callback) {
if (!callback && typeof options === 'function') {
callback = options;
options = {};
}

options = options || {};

const data = this.data;
const layout = data.hasOwnProperty('layout') ? data.layout : options.layout;
const locals = this._buildLocals(options);
const self = this;

return this._compiled(this._bindHelpers(locals)).then(result => {
if (result == null || !layout) return result;

const layoutView = self._resolveLayout(layout);
