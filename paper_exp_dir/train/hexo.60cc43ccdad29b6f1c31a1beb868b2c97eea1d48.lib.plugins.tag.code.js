'use strict';



var util = require('hexo-util');
var highlight = util.highlight;
var stripIndent = require('strip-indent');

var rCaptionUrlTitle = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)\s+(.+)/i;
var rCaptionUrl = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)/i;
var rCaption = /(\S[\S\s]*)/;
var rLang = /\s*lang:(\w+)/i;
var rLineNumber = /\s*line_number:(\w+)/i;
var rHighlight = /\s*highlight:(\w+)/i;
var rFirstLine = /\s*first_line:(\d+)/i;
var rMark = /\s*mark:([0-9,\-]+)/i;



module.exports = function(ctx) {
return function codeTag(args, content) {
var arg = args.join(' ');
var config = ctx.config.highlight || {};
var enable = config.enable;

if (rHighlight.test(arg)) {
arg = arg.replace(rHighlight, function() {
