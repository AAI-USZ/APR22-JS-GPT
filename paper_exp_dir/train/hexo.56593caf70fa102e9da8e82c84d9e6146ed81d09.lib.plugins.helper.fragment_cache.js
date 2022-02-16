'use strict';
const { Cache } = require('hexo-util');

module.exports = ctx => {
const cache = new Cache();


ctx.on('generateBefore', () => { cache.flush(); });

return function fragmentCache(id, fn) {
if (this.cache) return cache.apply(id, fn);

