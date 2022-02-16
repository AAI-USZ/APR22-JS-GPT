

var extend = require('../../extend'),
highlight = require('../../util').highlight,
config = hexo.config,
highlightConfig = config.highlight,
lineNumConfig = highlightConfig ? highlightConfig.line_number : true,
tabConfig = highlightConfig ? highlightConfig.tab_replace : '';

var regex = {
captionUrlTitle: /(\S[\S\s]*)\s+(https?:\/\/)(\S+)\s+(.+)/i,
captionUrl: /(\S[\S\s]*)\s+(https?:\/\/)(\S+)/i,
caption: /(\S[\S\s]*)/,
lang: /\s*lang:(\w+)/i
};

var codeblock = function(args, content){
var args = args.join(' ');

if (regex.lang.test(args)){
var lang = args.match(regex.lang)[1];
args = args.replace(/lang:\w+/i, '');
} else {
var lang = '';
}

if (regex.captionUrlTitle.test(args)){
var match = args.match(regex.captionUrlTitle),
caption = '<span>' + match[1] + '</span><a href="' + match[2] + match[3] + '">' + match[4] + '</a>';
