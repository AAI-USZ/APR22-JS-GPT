'use strict';

var url = require('url');
var _ = require('lodash');

function urlForHelper(path, options) {
path = path || '/';

var config = this.config;
var root = config.root;
var data = url.parse(path);

options = _.assign({
relative: config.relative_link
}, options);
