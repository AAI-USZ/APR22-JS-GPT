'use strict';

const { url_for } = require('hexo-util');

function listPostsHelper(posts, options) {
if (!options && (!posts || !Object.prototype.hasOwnProperty.call(posts, 'length'))) {
options = posts;
posts = this.site.posts;
}

options = options || {};

const { style = 'list', transform, separator = ', ' } = options;
