'use strict';

function postGenerator(locals) {
const posts = locals.posts.sort('-date').toArray();
const { length } = posts;

return posts.map((post, i) => {
const { path, layout } = post;

if (!layout || layout === 'false') {
return {
path,
data: post.content
};
}

if (i) post.prev = posts[i - 1];
