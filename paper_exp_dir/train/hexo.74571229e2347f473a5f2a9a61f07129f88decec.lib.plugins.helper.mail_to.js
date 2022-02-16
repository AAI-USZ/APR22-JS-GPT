'use strict';

var htmlTag = require('hexo-util').htmlTag;
var qs = require('querystring');

function mailToHelper(path, text, options){
options = options || {};

if (Array.isArray(path)) path = path.join(',');
if (!text) text = path;
