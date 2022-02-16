var util = require('util');
var inflection = require('inflection');

exports.inherits = util.inherits;

exports.escape = require('./escape');
exports.format = require('./format');
exports.fs = require('hexo-fs');
exports.highlight = require('./highlight');
exports.htmlTag = exports.html_tag = require('./html_tag');
exports.permalink = require('./permalink');
