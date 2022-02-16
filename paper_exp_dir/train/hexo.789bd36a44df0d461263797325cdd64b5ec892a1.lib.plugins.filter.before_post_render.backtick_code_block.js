'use strict';

var stripIndent = require('strip-indent');
var util = require('hexo-util');
var highlight = util.highlight;

var rBacktick = /(\s*)(`{3,}|~{3,}) *(.*) *\n([\s\S]+?)\s*\2(\n+|$)/g;
var rAllOptions = /([^\s]+)\s+(.+?)\s+(https?:\/\/\S+|\/\S+)\s*(.+)?/;
var rLangCaption = /([^\s]+)\s*(.+)?/;

function backtickCodeBlock(data){

var config = this.config.highlight || {};
if (!config.enable) return;

data.content = data.content.replace(rBacktick, function(){
var start = arguments[1];
var end = arguments[5];
var args = arguments[3];
var content = arguments[4];

var options = {
auto_detect: config.auto_detect,
gutter: config.line_number,
tab: config.tab_replace
};

if (args){
var match;

if (rAllOptions.test(args)){
match = args.match(rAllOptions);
