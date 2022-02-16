var util = require('../../util'),
highlight = util.highlight;

var rBacktick = / *(`{3,}|~{3,}) *([^\n]+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/g,
rAllOptions = /([^\s]+)\s+(.+?)\s+(https?:\/\/\S+|\/\S+)\s*(.+)?/i,
rLangCaption = /([^\s]+)\s*(.+)?/i;

module.exports = function(data, callback){
var config = hexo.config.highlight || {};

if (!config.enable) return callback();

data.content = data.content.replace(rBacktick, function(){
var args = arguments[2],
str = arguments[3];

var options = {
gutter: config.line_number,
tab: config.tab_replace
};

var indent = str.match(/^(\t*)/)[1].length,
code = [],
match;

if (args){
if (rAllOptions.test(args)){
match = args.match(rAllOptions);
} else if (rLangCaption.test(args)){
match = args.match(rLangCaption);
}

