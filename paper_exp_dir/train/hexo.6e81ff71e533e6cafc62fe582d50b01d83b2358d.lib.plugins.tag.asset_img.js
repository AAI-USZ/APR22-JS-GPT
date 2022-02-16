'use strict';

var url = require('url');


module.exports = function(ctx) {
var PostAsset = ctx.model('PostAsset');

return function assetImgTag(args) {
var slug = args.shift();
if (!slug) return;

