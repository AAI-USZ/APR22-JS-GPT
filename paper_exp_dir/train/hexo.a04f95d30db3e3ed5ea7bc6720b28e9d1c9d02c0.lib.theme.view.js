'use strict';

const { dirname, extname, join } = require('path');
const yfm = require('hexo-front-matter');
const Promise = require('bluebird');

const assignIn = (target, ...sources) => {
const length = sources.length;

if (length < 1 || target == null) return target;
for (let i = 0; i < length; i++) {
const source = sources[i];

for (const key in source) {
target[key] = source[key];
}
}
return target;
};

function View(path, data) {
this.path = path;
this.source = join(this._theme.base, 'layout', path);
this.data = typeof data === 'string' ? yfm(data) : data;

this._precompile();
}

View.prototype.render = function(options = {}, callback) {
if (!callback && typeof options === 'function') {
callback = options;
options = {};
}
const { data } = this;
const { layout = options.layout } = data;
const locals = this._buildLocals(options);

return this._compiled(this._bindHelpers(locals)).then(result => {
if (result == null || !layout) return result;

const layoutView = this._resolveLayout(layout);
if (!layoutView) return result;

const layoutLocals = {
