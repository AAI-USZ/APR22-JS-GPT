'use strict';

var _ = require('lodash');

function postGenerator(locals){
var posts = locals.posts.sort('-date').toArray();
var length = posts.length;

return posts.map(function(post, i){
var layout = post.layout;
var path = post.path;

