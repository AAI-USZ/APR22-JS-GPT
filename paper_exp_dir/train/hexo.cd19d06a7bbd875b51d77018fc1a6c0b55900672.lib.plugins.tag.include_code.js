var fs = require('graceful-fs'),
pathFn = require('path'),
util = require('../../util'),
file = util.file2,
highlight = util.highlight;

var rCaptionTitleFile = /(.*)?(\s+|^)(\

module.exports = function(args, callback){
var codeDir = hexo.config.code_dir,
sourceDir = hexo.source_dir,
config = hexo.config.highlight || {},
arg = args.join(' ');


if (codeDir[codeDir.length - 1] !== '/') codeDir += '/';

if (rLang.test(arg)){
var lang = arg.match(rLang)[1];
arg = arg.replace(/lang:\w+/i, '');
} else {
var lang = '';
}

if (rCaptionTitleFile.test(arg)){
var match = arg.match(rCaptionTitleFile),
title = match[1],
path = match[3];
}


if (!path) return;

var local = pathFn.join(sourceDir, codeDir, path);


if (!fs.existsSync(local)) return;

var code = file.readFileSync(local);


title = title || pathFn.basename(path);


lang = lang || pathFn.extname(path).substring(1);

caption = '<span>' + title + '</span><a href="' + codeDir + path + '">download</a>';

return highlight(code, {
lang: lang,
caption: caption,
gutter: config.line_number,
tab: config.tab_replace
});
};
