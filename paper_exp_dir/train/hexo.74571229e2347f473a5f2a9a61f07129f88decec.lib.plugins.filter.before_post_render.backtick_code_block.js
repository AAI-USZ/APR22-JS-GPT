'use strict';

var stripIndent = require('strip-indent');
var util = require('hexo-util');
var highlight = util.highlight;

var rBacktick = /(\s*)(`{3,}|~{3,}) *(.*) *\n([\s\S]+?)\s*\2(\n+|$)/g;
var rAllOptions = /([^\s]+)\s+(.+?)\s+(https?:\/\/\S+|\/\S+)\s*(.+)?/;
var rLangCaption = /([^\s]+)\s*(.+)?/;

