'use strict';

const { exists, readFile } = require('hexo-fs');
const { basename, extname, join } = require('path');


let highlight, prismHighlight;

const rCaptionTitleFile = /(.*)?(?:\s+|^)(\

module.exports = ctx => function includeCodeTag(args) {
let codeDir = ctx.config.code_dir;
let arg = args.join(' ');


if (!codeDir.endsWith('/')) codeDir += '/';

