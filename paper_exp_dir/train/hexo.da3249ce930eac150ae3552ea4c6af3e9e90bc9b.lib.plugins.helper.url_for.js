'use strict';

const url = require('url');

function urlForHelper(path = '/', options) {
if (path[0] === '#' || path.startsWith('//')) {
return path;
}

const config = this.config;
const root = config.root;
const data = url.parse(path);

