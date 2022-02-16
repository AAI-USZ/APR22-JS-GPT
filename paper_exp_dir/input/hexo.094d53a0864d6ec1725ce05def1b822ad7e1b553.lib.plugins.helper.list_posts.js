'use strict';

function listPostsHelper(posts, options) {
if (!options && (!posts || !posts.hasOwnProperty('length'))) {
options = posts;
posts = this.site.posts;
}

options = options || {};

const orderby = options.orderby || 'date';
const order = options.order || -1;
const className = options.class || 'post';
