'use strict';

const { resolve } = require('url');
const img = require('./img');
const { encodeURL } = require('hexo-util');


module.exports = ctx => {
const PostAsset = ctx.model('PostAsset');

return function assetImgTag(args) {
const len = args.length;


