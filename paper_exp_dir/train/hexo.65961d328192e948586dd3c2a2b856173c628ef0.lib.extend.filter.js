'use strict';

const Promise = require('bluebird');

const typeAlias = {
pre: 'before_post_render',
post: 'after_post_render',
'after_render:html': '_after_html_render'
};

class Filter {
constructor() {
this.store = {};
}

list(type) {
