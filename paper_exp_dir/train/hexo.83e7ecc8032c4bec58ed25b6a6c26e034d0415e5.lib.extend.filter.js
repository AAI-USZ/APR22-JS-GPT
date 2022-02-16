'use strict';

const Promise = require('bluebird');

const typeAlias = {
pre: 'before_post_render',
post: 'after_post_render'
};

class Filter {
constructor() {
this.store = {};
}

list(type) {
if (!type) return this.store;
return this.store[type] || [];
}

register(type, fn, priority) {
if (!priority) {
if (typeof type === 'function') {
priority = fn;
fn = type;
type = 'after_post_render';
}
}

if (typeof fn !== 'function') throw new TypeError('fn must be a function');

if (type === 'after_render:html') type = '_after_html_render';

type = typeAlias[type] || type;
priority = priority == null ? 10 : priority;

const store = this.store[type] || [];
this.store[type] = store;

fn.priority = priority;
store.push(fn);
