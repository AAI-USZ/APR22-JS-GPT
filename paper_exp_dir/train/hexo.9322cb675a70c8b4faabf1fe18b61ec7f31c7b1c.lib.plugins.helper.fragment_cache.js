'use strict';

module.exports = ctx => {
let cache = {};


ctx.on('generateBefore', () => { cache = {}; });

return function fragmentCache(id, fn) {
if (this.cache && cache[id] != null) return cache[id];

const result = fn();

cache[id] = result;
return result;
};
