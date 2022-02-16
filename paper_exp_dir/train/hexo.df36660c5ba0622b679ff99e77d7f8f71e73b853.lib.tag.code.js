

var extend = require('../extend'),
highlight = require('../util').highlight;

var regex = {
captionUrlTitle: /(\S[\S\s]*)\s+(https?:\/\/)(\S+)\s+(.+)/i,
captionUrl: /(\S[\S\s]*)\s+(https?:\/\/)(\S+)/i,
caption: /(\S[\S\s]*)/,
lang: /\s*lang:(\w+)/i
};

var codeblock = function(args, content){
var args = args.join(' ');

var langPart = args.match(regex.lang);
if (langPart){
var lang = langPart[1];
args = args.replace(/lang:\w+/i, '');
}

var captionPart = args.match(regex.captionUrlTitle);
if (captionPart){
