'use strict';

function listPostsHelper(posts, options) {
if (!options && (!posts || !posts.hasOwnProperty('length'))) {
options = posts;
posts = this.site.posts;
}

options = options || {};

const style = options.hasOwnProperty('style') ? options.style : 'list';
const orderby = options.orderby || 'date';
const order = options.order || -1;
const className = options.class || 'post';
const transform = options.transform;
const separator = options.hasOwnProperty('separator') ? options.separator : ', ';
const amount = options.amount || 6;
let result = '';


posts = posts.sort(orderby, order);


if (amount) posts = posts.limit(amount);

if (style === 'list') {
result += `<ul class="${className}-list">`;

posts.forEach(post => {
const title = post.title || post.slug;
