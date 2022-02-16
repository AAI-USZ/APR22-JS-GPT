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
enable = arguments[1] === 'true';
return '';
});
}

if (!enable) {
return '<pre><code>' + content + '</code></pre>';
}

var caption = '';
var lang = '';
var line_number = config.line_number;
var first_line = 1;
var mark = [];
var match;

if (rLang.test(arg)) {
arg = arg.replace(rLang, function() {
lang = arguments[1];
return '';
});
}

if (rLineNumber.test(arg)) {
arg = arg.replace(rLineNumber, function() {
line_number = arguments[1] === 'true';
return '';
});
}

if (rFirstLine.test(arg)) {
arg = arg.replace(rFirstLine, function() {
first_line = arguments[1];
return '';
});
}

if (rMark.test(arg)) {
arg = arg.replace(rMark, function() {
mark = arguments[1].split(',').reduce(function getMarkedLines(prev, cur) {
var a, b, temp;
if (/\-/.test(cur)) {
a = Number(cur.substr(0, cur.indexOf('-')));
b = Number(cur.substr(cur.indexOf('-') + 1));
if (b < a) {
temp = a; a = b; b = temp;
}

for (; a <= b; a++) {
prev.push(a);
}

return prev;
}

prev.push(Number(cur));
return prev;
