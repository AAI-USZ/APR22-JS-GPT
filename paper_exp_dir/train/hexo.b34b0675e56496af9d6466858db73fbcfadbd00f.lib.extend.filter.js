'use strict';

const Promise = require('bluebird');

const typeAlias = {
pre: 'before_post_render',
post: 'after_post_render'
};

function Filter() {
this.store = {};
}

Filter.prototype.list = function(type) {
if (!type) return this.store;
return this.store[type] || [];
};

Filter.prototype.register = function(type, fn, priority) {
if (!priority) {
if (typeof type === 'function') {
priority = fn;
fn = type;
type = 'after_post_render';
}
}

if (typeof fn !== 'function') throw new TypeError('fn must be a function');

type = typeAlias[type] || type;
priority = priority == null ? 10 : priority;

this.store[type] = this.store[type] || [];
const store = this.store[type] || [];

fn.priority = priority;
store.push(fn);

store.sort((a, b) => a.priority - b.priority);
};

Filter.prototype.unregister = function(type, fn) {
