'use strict';


module.exports = function(ctx){
var PostAsset = ctx.model('PostAsset');

return function assetImgTag(args){
var slug = args.shift();
if (!slug) return;

var asset = PostAsset.findOne({post: this._id, slug: slug});
if (!asset) return;


var title = args.length ? args.join(' ') : '';

