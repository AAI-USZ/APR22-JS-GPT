

var util = require('hexo-util');
var highlight = util.highlight;
var stripIndent = require('strip-indent');

var rCaptionUrlTitle = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)\s+(.+)/i;
var rCaptionUrl = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)/i;
var rCaption = /(\S[\S\s]*)/;
var rLang = /\s*lang:(\w+)/i;



module.exports = function(ctx){
return function codeTag(args, content){
var arg = args.join(' ');
