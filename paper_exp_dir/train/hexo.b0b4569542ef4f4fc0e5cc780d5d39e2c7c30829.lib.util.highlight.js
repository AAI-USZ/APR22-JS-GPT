var hljs = require('highlight.js'),
_ = require('underscore');

module.exports = function(code, lang, caption){
if (lang){
var lang = lang.toLowerCase();

switch (lang){
case 'js':
lang = 'javascript';
