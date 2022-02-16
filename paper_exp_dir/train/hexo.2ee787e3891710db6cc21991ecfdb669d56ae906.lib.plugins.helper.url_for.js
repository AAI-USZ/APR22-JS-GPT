'use strict';

const url = require('url');
const _ = require('lodash');

function urlForHelper(path = '/', options) {
if (path[0] === '#' || path.substring(0, 2) === '//') {
return path;
}

const config = this.config;
const root = config.root;
const data = url.parse(path);
