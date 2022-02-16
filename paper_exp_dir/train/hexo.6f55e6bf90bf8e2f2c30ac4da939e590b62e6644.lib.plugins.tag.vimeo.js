'use strict';

const { htmlTag } = require('hexo-util');



function vimeoTag(id) {
const src = 'https://player.vimeo.com/video/' + id;

const iframeTag = htmlTag('iframe', {
src,
