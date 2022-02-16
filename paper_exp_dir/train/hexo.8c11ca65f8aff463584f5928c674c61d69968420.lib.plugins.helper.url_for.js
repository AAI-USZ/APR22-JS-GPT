'use strict';

var url = require('url');
var _ = require('lodash');

function urlForHelper(path, options) {
path = path || '/';

if (path[0] === '#' || path.substring(0, 2) === '//') {
return path;
}

var config = this.config;
var root = config.root;
