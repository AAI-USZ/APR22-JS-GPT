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

const match = arg.match(rCaptionTitleFile);


if (!match) return;

const path = match[2];


const title = match[1] || basename(path);


lang = lang || extname(path).substring(1);

const src = join(ctx.source_dir, codeDir, path);

