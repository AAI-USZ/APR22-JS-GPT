'use strict';

var url = require('url');
var _ = require('lodash');
var relative_url = require('./relative_url');

function urlForHelper(path, options) {
path = path || '/';

if (path[0] === '#' || path.substring(0, 2) === '//') {
return path;
}

var config = this.config;
