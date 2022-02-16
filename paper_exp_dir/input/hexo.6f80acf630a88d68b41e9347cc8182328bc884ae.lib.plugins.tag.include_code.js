'use strict';

var fs = require('hexo-fs');
var pathFn = require('path');
var stripIndent = require('strip-indent');
var util = require('hexo-util');
var highlight = util.highlight;

var rCaptionTitleFile = /(.*)?(\s+|^)(\

module.exports = function(ctx) {
return function includeCodeTag(args) {
var config = ctx.config.highlight || {};
var codeDir = ctx.config.code_dir;
var arg = args.join(' ');
var path = '';
var title = '';
var lang = '';
var caption = '';


if (codeDir[codeDir.length - 1] !== '/') codeDir += '/';

if (rLang.test(arg)) {
arg = arg.replace(rLang, function() {
lang = arguments[1];
return '';
});
}

if (rCaptionTitleFile.test(arg)) {
var match = arg.match(rCaptionTitleFile);
title = match[1];
path = match[3];
}


if (!path) return;

var src = pathFn.join(ctx.source_dir, codeDir, path);

return fs.exists(src).then(function(exist) {
if (exist) return fs.readFile(src);
}).then(function(code) {
if (!code) return;

code = stripIndent(code).trim();

if (!config.enable) {
return '<pre><code>' + code + '</code></pre>';
}


title = title || pathFn.basename(path);


lang = lang || pathFn.extname(path).substring(1);

caption = '<span>' + title + '</span><a href="' + ctx.config.root + codeDir + path + '">view raw</a>';

return highlight(code, {
lang: lang,
caption: caption,
gutter: config.line_number,
});
