'use strict';


module.exports = function(ctx){
var PostAsset = ctx.model('PostAsset');

return function assetPathTag(args){
var slug = args.shift();
if (!slug) return;

