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

let title = '';
let path = '';

const match = arg.match(rCaptionTitleFile);

if (match) {
title = match[1];
path = match[2];
}


if (!path) return;


title = title || basename(path);


lang = lang || extname(path).substring(1);

const src = join(ctx.source_dir, codeDir, path);

const caption = `<span>${title}</span><a href="${ctx.config.root}${codeDir}${path}">view raw</a>`;

