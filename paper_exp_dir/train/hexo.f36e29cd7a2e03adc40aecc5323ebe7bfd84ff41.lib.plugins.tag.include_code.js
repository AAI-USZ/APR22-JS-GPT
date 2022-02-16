'use strict';

const fs = require('hexo-fs');
const { basename, extname, join } = require('path');
const { highlight, prismHighlight } = require('hexo-util');

const rCaptionTitleFile = /(.*)?(?:\s+|^)(\

module.exports = ctx => function includeCodeTag(args) {
let codeDir = ctx.config.code_dir;
let arg = args.join(' ');


if (codeDir[codeDir.length - 1] !== '/') codeDir += '/';

let lang = '';
arg = arg.replace(rLang, (match, _lang) => {
lang = _lang;
return '';
