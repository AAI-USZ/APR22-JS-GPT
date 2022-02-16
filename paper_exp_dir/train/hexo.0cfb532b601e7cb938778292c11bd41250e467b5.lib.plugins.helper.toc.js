'use strict';

const { tocObj } = require('hexo-util');

function tocHelper(str, options = {}) {
options = Object.assign({
min_depth: 1,
max_depth: 6,
class: 'toc',
list_number: true
}, options);

const data = tocObj(str, { min_depth: options.min_depth, max_depth: options.max_depth });

if (!data.length) return '';

