'use strict';

const { exists, readFile } = require('hexo-fs');
const { basename, extname, join } = require('path');


let highlight, prismHighlight;

const rCaptionTitleFile = /(.*)?(?:\s+|^)(\

module.exports = ctx => function includeCodeTag(args) {
let codeDir = ctx.config.code_dir;
let arg = args.join(' ');


if (!codeDir.endsWith('/')) codeDir += '/';

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

const match = arg.match(rCaptionTitleFile);


if (!match) return;

const path = match[2];


lang = lang || extname(path).substring(1);

const src = join(ctx.source_dir, codeDir, path);


const title = match[1] || basename(path);
const caption = `<span>${title}</span><a href="${ctx.config.root}${codeDir}${path}">view raw</a>`;

const hljsCfg = ctx.config.highlight || {};
const prismjsCfg = ctx.config.prismjs || {};

const hljsOptions = {
lang,
caption,
gutter: hljsCfg.line_number,
hljs: hljsCfg.hljs,
tab: hljsCfg.tab_replace
};

const prismjsOptions = {
lang,
caption,
lineNumber: prismjsCfg.line_number,
tab: prismjsCfg.tab_replace,
isPreprocess: prismjsCfg.preprocess
};

return exists(src).then(exist => {
if (exist) return readFile(src);
}).then(code => {
if (!code) return;
