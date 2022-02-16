'use strict';


module.exports = function(ctx){
var Post = ctx.model('Post');

return function postPathTag(args){
var slug = args.shift();
if (!slug) return;

