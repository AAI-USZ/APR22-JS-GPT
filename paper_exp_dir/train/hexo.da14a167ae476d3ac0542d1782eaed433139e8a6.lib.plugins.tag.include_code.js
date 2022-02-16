'use strict';

const fs = require('hexo-fs');
const { basename, extname, join } = require('path');
const stripIndent = require('strip-indent');
const { highlight } = require('hexo-util');

const rCaptionTitleFile = /(.*)?(?:\s+|^)(\

module.exports = ctx => function includeCodeTag(args) {
const config = ctx.config.highlight || {};
let codeDir = ctx.config.code_dir;
let arg = args.join(' ');


if (codeDir[codeDir.length - 1] !== '/') codeDir += '/';

let lang = '';
arg = arg.replace(rLang, (match, _lang) => {
lang = _lang;
return '';
});
let from = 0;
arg = arg.replace(rFrom, (match, _from) => {
from = _from - 1;
return '';
});
let to = Number.MAX_VALUE;
arg = arg.replace(rTo, (match, _to) => {
to = _to;
return '';
});
