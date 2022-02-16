'use strict';

var url = require('url');
var img = require('./img');


module.exports = function(ctx) {
var PostAsset = ctx.model('PostAsset');

return function assetImgTag(args) {
var asset;
var item = '';
var i = 0;
var len = args.length;
