'use strict';

const url_for = require('../helper/url_for');


module.exports = ctx => {
const PostAsset = ctx.model('PostAsset');

return function assetPathTag(args) {
const slug = args.shift();
if (!slug) return;

