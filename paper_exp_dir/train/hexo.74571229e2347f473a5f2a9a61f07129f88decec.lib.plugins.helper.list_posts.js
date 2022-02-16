'use strict';

function listPostsHelper(posts, options){

if (!options && (!posts || !posts.hasOwnProperty('length'))){
options = posts;
posts = this.site.posts;
}

options = options || {};
