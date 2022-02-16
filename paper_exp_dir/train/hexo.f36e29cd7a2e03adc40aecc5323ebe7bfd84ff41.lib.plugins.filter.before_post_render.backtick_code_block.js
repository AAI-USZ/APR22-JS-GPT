'use strict';

let highlight, prismHighlight;

const rBacktick = /^((?:[^\S\r\n]*>){0,3}[^\S\r\n]*)(`{3,}|~{3,})[^\S\r\n]*((?:.*?[^`\s])?)[^\S\r\n]*\n((?:[\s\S]*?\n)?)(?:(?:[^\S\r\n]*>){0,3}[^\S\r\n]*)\2(\n+|$)/gm;
const rAllOptions = /([^\s]+)\s+(.+?)\s+(https?:\/\/\S+|\/\S+)\s*(.+)?/;
const rLangCaption = /([^\s]+)\s*(.+)?/;

const escapeSwigTag = str => str.replace(/{/g, '&#123;').replace(/}/g, '&#125;');

function backtickCodeBlock(data) {
const hljsCfg = this.config.highlight || {};
const prismCfg = this.config.prismjs || {};

data.content = data.content.replace(rBacktick, ($0, start, $2, _args, _content, end) => {
let content = _content.replace(/\n$/, '');

