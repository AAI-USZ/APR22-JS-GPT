

var util = require('hexo-util');
var highlight = util.highlight;

var rCaptionUrlTitle = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)\s+(.+)/i,
rCaptionUrl = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)/i,
rCaption = /(\S[\S\s]*)/,
rLang = /\s*lang:(\w+)/i;



module.exports = function(ctx){
return function(args, content){
var arg = args.join(' '),
config = ctx.config.highlight || {},
caption = '',
lang = '',
match;

if (rLang.test(arg)){
lang = arg.match(rLang)[1];
arg = arg.replace(/lang:\w+/i, '');
}

if (rCaptionUrlTitle.test(arg)){
match = arg.match(rCaptionUrlTitle);
caption = '<span>' + match[1] + '</span><a href="' + match[2] + match[3] + '">' + match[4] + '</a>';
} else if (rCaptionUrl.test(arg)){
match = arg.match(rCaptionUrl);
caption = '<span>' + match[1] + '</span><a href="' + match[2] + match[3] + '">link</a>';
} else if (rCaption.test(arg)){
match = arg.match(rCaption);
caption = '<span>' + match[1] + '</span>';
}

return highlight(content.replace(/\n+$/, ''), {
lang: lang,
caption: caption,
gutter: config.line_number,
tab: config.tab_replace
});
};
};
