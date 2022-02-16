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

class View {
constructor(path, data) {
this.path = path;
this.source = join(this._theme.base, 'layout', path);
this.data = typeof data === 'string' ? yfm(data) : data;

this._precompile();
}

render(options = {}, callback) {
