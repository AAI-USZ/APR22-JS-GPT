'use strict';

const { htmlTag } = require('hexo-util');



function iframeTag(args) {
const src = args[0];
const width = args[1] && args[1] !== 'default' ? args[1] : '100%';
const height = args[2] && args[2] !== 'default' ? args[2] : '300';

const attrs = {
src,
