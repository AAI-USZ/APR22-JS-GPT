'use strict';

const stripIndent = require('strip-indent');
const util = require('hexo-util');
const highlight = util.highlight;

const rBacktick = /(\s*)(`{3,}|~{3,}) *(.*) *\n([\s\S]+?)\s*\2(\n+|$)/g;
const rAllOptions = /([^\s]+)\s+(.+?)\s+(https?:\/\/\S+|\/\S+)\s*(.+)?/;
const rLangCaption = /([^\s]+)\s*(.+)?/;

function backtickCodeBlock(data) {
const config = this.config.highlight || {};
if (!config.enable) return;
data.content = data.content.replace(rBacktick, function() {
const start = arguments[1];
const end = arguments[5];
const args = arguments[3].split('=').shift();
