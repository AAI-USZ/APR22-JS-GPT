'use strict';

const htmlTag = require('hexo-util').htmlTag;

function imageTagHelper(path, options = {}) {
const attrs = {
src: this.url_for(path)
};

const keys = Object.keys(options);
let key = '';

for (let i = 0, len = keys.length; i < len; i++) {
