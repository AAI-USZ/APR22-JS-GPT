var fs = require('hexo-fs'),
pathFn = require('path'),
util = require('../../util'),
file = util.file2,
highlight = util.highlight;

var rCaptionTitleFile = /(.*)?(\s+|^)(\

module.exports = function(ctx){
return function(args){
var codeDir = ctx.config.code_dir,
sourceDir = ctx.source_dir,
config = ctx.config.highlight || {},
arg = args.join(' '),
path = '',
title = '',
lang = '',
caption = '';


if (codeDir[codeDir.length - 1] !== '/') codeDir += '/';

if (rLang.test(arg)){
lang = arg.match(rLang)[1];
arg = arg.replace(/lang:\w+/i, '');
}

if (rCaptionTitleFile.test(arg)){
var match = arg.match(rCaptionTitleFile);
title = match[1];
path = match[3];
}


if (!path) return;

var local = pathFn.join(sourceDir, codeDir, path);


if (!fs.existsSync(local)) return;

var code = file.readFileSync(local).replace(/\n$/, '');


title = title || pathFn.basename(path);


lang = lang || pathFn.extname(path).substring(1);

caption = '<span>' + title + '</span><a href="/' + codeDir + path + '">download</a>';

return highlight(code, {
lang: lang,
caption: caption,
gutter: config.line_number,
tab: config.tab_replace
});
};
};
