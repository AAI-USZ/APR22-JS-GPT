

var util = require('../../util'),
highlight = util.highlight;

var rCaptionUrlTitle = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)\s+(.+)/i,
rCaptionUrl = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)/i,
rCaption = /(\S[\S\s]*)/,
rLang = /\s*lang:(\w+)/i;



module.exports = function(args, content){
var arg = args.join(' '),
config = hexo.config.highlight || {},
caption = '',
lang = '',
match;

if (rLang.test(arg)){
lang = arg.match(rLang)[1];
arg = arg.replace(/lang:\w+/i, '');
}

