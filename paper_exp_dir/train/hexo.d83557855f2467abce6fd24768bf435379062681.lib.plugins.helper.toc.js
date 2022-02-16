'use strict';

const { tocObj, escapeHTML, encodeURL } = require('hexo-util');

function tocHelper(str, options = {}) {
options = Object.assign({
min_depth: 1,
max_depth: 6,
class: 'toc',
list_number: true
}, options);

const data = tocObj(str, { min_depth: options.min_depth, max_depth: options.max_depth });

if (!data.length) return '';

const className = escapeHTML(options.class);
const listNumber = options.list_number;

let result = `<ol class="${className}">`;

const lastNumber = [0, 0, 0, 0, 0, 0];
let firstLevel = 0;
let lastLevel = 0;

for (let i = 0, len = data.length; i < len; i++) {
const el = data[i];
