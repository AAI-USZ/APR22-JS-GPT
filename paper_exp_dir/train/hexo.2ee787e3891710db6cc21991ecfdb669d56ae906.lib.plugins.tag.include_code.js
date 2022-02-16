'use strict';

const fs = require('hexo-fs');
const pathFn = require('path');
const stripIndent = require('strip-indent');
const util = require('hexo-util');
const highlight = util.highlight;

const rCaptionTitleFile = /(.*)?(\s+|^)(\

module.exports = ctx => function includeCodeTag(args) {
const config = ctx.config.highlight || {};
let codeDir = ctx.config.code_dir;
let arg = args.join(' ');
