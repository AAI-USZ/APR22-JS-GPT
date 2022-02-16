'use strict';

const pathFn = require('path');
const assignIn = require('lodash/assignIn');
const omit = require('lodash/omit');
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

return this._compiled(this._bindHelpers(locals)).then(result => {
if (result == null || !layout) return result;

const layoutView = this._resolveLayout(layout);
if (!layoutView) return result;

const layoutLocals = Object.assign({}, locals, {
body: result,
layout: false
