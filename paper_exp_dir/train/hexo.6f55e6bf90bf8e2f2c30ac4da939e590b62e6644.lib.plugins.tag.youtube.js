'use strict';

const { htmlTag } = require('hexo-util');



function youtubeTag(id) {
const src = 'https://www.youtube.com/embed/' + id;

const iframeTag = htmlTag('iframe', {
src,
