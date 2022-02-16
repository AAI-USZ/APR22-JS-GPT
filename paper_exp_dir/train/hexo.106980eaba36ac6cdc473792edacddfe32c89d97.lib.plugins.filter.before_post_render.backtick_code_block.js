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
data.content = data.content.replace(rBacktick, ($0, start, $2, _args, content, end) => {
const args = _args.split('=').shift();

const options = {
hljs: config.hljs,
autoDetect: config.auto_detect,
gutter: config.line_number,
tab: config.tab_replace
};

