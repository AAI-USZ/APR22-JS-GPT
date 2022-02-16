'use strict';

const stripIndent = require('strip-indent');
const { highlight } = require('hexo-util');

const rBacktick = /^((?:[^\S\r\n]*>){0,3}[^\S\r\n]*)(`{3,}|~{3,}) *(.*) *\n([\s\S]+?)\s*\2(\n+|$)/gm;
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
tab: config.tab_replace,
wrap: config.wrap
};

if (options.gutter) {
config.first_line_number = config.first_line_number || 'always1';
if (config.first_line_number === 'inline') {


_args = _args.replace('=+', '=');
options.gutter = _args.includes('=');
