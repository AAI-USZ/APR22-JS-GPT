var hljs = require('highlight.js');

module.exports = function(code, lang, caption){
switch (lang){
case 'js':
lang = 'javascript';
break;

case 'html':
lang = 'xml';
break;
}
