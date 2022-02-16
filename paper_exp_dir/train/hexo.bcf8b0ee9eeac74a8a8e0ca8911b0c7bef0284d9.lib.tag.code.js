

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
} else {
var lang = '';
}

var captionPart = args.match(regex.captionUrlTitle);
if (captionPart){
var caption = '<span>' + captionPart[1] + '</span><a href="' + captionPart[2] + captionPart[3] + '">' + captionPart[4] + '</a>';
} else {
var captionPart = args.match(regex.captionUrl);
if (captionPart){
