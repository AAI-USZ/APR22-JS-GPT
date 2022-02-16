'use strict';

const fs = require('hexo-fs');
const { basename, extname, join } = require('path');
const { highlight } = require('hexo-util');

const rCaptionTitleFile = /(.*)?(?:\s+|^)(\

module.exports = ctx => function includeCodeTag(args) {
const config = ctx.config.highlight || {};
let codeDir = ctx.config.code_dir;
let arg = args.join(' ');


if (codeDir[codeDir.length - 1] !== '/') codeDir += '/';
