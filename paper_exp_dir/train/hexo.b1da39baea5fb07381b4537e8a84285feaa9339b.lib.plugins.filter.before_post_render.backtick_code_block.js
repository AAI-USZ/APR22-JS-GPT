'use strict';

let highlight, prismHighlight;

const rBacktick = /^((?:[^\S\r\n]*>){0,3}[^\S\r\n]*)(`{3,}|~{3,})[^\S\r\n]*((?:.*?[^`\s])?)[^\S\r\n]*\n((?:[\s\S]*?\n)?)(?:(?:[^\S\r\n]*>){0,3}[^\S\r\n]*)\2(\n+|$)/gm;
const rAllOptions = /([^\s]+)\s+(.+?)\s+(https?:\/\/\S+|\/\S+)\s*(.+)?/;
const rLangCaption = /([^\s]+)\s*(.+)?/;

const escapeSwigTag = str => str.replace(/{/g, '&#123;').replace(/}/g, '&#125;');

function backtickCodeBlock(data) {
const dataContent = data.content;

if (!dataContent.includes('```') && !dataContent.includes('~~~')) return;

const hljsCfg = this.config.highlight || {};
const prismCfg = this.config.prismjs || {};

data.content = dataContent.replace(rBacktick, ($0, start, $2, _args, _content, end) => {
let content = _content.replace(/\n$/, '');


if (!hljsCfg.enable && !prismCfg.enable) return escapeSwigTag($0);


const args = _args.split('=').shift();
let lang, caption;

if (args) {
const match = rAllOptions.exec(args) || rLangCaption.exec(args);

if (match) {
lang = match[1];

if (match[2]) {
caption = `<span>${match[2]}</span>`;

if (match[3]) {
caption += `<a href="${match[3]}">${match[4] ? match[4] : 'link'}</a>`;
}
}
}
}


if (start.includes('>')) {

const depth = start.split('>').length - 1;
const regexp = new RegExp(`^([^\\S\\r\\n]*>){0,${depth}}([^\\S\\r\\n]|$)`, 'mg');
content = content.replace(regexp, '');
}


if (prismCfg.enable) {
if (!prismHighlight) prismHighlight = require('hexo-util').prismHighlight;

const options = {
lineNumber: prismCfg.line_number,
tab: prismCfg.tab_replace,
isPreprocess: prismCfg.preprocess,
lang,
caption
};

content = prismHighlight(content, options);
} else if (hljsCfg.enable) {
if (!highlight) highlight = require('hexo-util').highlight;

const options = {
hljs: hljsCfg.hljs,
