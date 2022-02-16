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

