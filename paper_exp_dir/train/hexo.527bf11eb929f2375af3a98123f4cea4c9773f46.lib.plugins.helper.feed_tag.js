'use strict';

function feedTagHelper(path, options = {}) {
const { config } = this;
const title = options.title || config.title;
const { feed } = config;

if (path) {
if (typeof path !== 'string') throw new TypeError('path must be a string!');
