'use strict';

const { url_for } = require('hexo-util');

const feedFn = (str = '') => {
if (str) return str.replace(/2$/, '');
return str;
};

function feedTagHelper(path, options = {}) {
const { config } = this;
const title = options.title || config.title;
