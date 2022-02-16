'use strict';

const { highlight } = require('hexo-util');

const rBacktick = /^((?:[^\S\r\n]*>){0,3}[^\S\r\n]*)(`{3,}|~{3,})[^\S\r\n]*((?:.*?[^`\s])?)[^\S\r\n]*\n((?:[\s\S]*?\n)?)(?:(?:[^\S\r\n]*>){0,3}[^\S\r\n]*)\2(\n+|$)/gm;
const rAllOptions = /([^\s]+)\s+(.+?)\s+(https?:\/\/\S+|\/\S+)\s*(.+)?/;
const rLangCaption = /([^\s]+)\s*(.+)?/;

function backtickCodeBlock(data) {
const config = this.config.highlight || {};
if (!config.enable) return;
data.content = data.content.replace(rBacktick, ($0, start, $2, _args, _content, end) => {
let content = _content.replace(/\n$/, '');
const args = _args.split('=').shift();

const options = {
hljs: config.hljs,
autoDetect: config.auto_detect,
gutter: config.line_number,
tab: config.tab_replace,
