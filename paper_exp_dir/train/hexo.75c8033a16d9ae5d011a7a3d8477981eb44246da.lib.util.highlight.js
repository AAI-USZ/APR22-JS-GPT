var hljs = require('highlight.js');

module.exports = function(code, lang, caption){
if (lang){
var lang = lang.toLowerCase();

switch (lang){
case 'js':
lang = 'javascript';
break;

case 'html':
lang = 'xml';
break;

case 'yml':
lang = 'yaml';
break;

case 'pl':
lang = 'perl';
break;

case 'ru':
