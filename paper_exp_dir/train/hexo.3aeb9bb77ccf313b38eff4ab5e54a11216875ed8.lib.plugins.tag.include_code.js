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
if (rLang.test(arg)) {
arg = arg.replace(rLang, (match, _lang) => {
lang = _lang;
return '';
});
}

let title = '';
let path = '';
if (rCaptionTitleFile.test(arg)) {
const match = arg.match(rCaptionTitleFile);
title = match[1];
path = match[2];
}


if (!path) return;

const src = join(ctx.source_dir, codeDir, path);

return fs.exists(src).then(exist => {
if (exist) return fs.readFile(src);
}).then(code => {
if (!code) return;

code = stripIndent(code).trim();

if (!config.enable) {
return `<pre><code>${code}</code></pre>`;
}


title = title || basename(path);


lang = lang || extname(path).substring(1);

const caption = `<span>${title}</span><a href="${ctx.config.root}${codeDir}${path}">view raw</a>`;

return highlight(code, {
lang,
caption,
gutter: config.line_number,
hljs: config.hljs,
tab: config.tab_replace
});
});
};
