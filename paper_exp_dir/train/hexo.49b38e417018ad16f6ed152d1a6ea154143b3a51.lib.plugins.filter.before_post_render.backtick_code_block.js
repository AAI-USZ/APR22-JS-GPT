'use strict';

const { highlight } = require('hexo-util');

const rBacktick = /^((?:[^\S\r\n]*>){0,3}[^\S\r\n]*)(`{3,}|~{3,}) *(.*) *\n([\s\S]+?)\s*\2(\n+|$)/gm;
const rAllOptions = /([^\s]+)\s+(.+?)\s+(https?:\/\/\S+|\/\S+)\s*(.+)?/;
const rLangCaption = /([^\s]+)\s*(.+)?/;

function backtickCodeBlock(data) {
const config = this.config.highlight || {};
if (!config.enable) return;
data.content = data.content.replace(rBacktick, ($0, start, $2, _args, content, end) => {
