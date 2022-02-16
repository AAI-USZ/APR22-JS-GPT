'use strict';


module.exports = function(ctx){
var Post = ctx.model('Post');

return function postLinkTag(args){
var slug = args.shift();
if (!slug) return;

