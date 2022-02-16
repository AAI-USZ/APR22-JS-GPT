


var extend = require('../../extend'),
util = require('../../util'),
highlight = util.highlight,
config = hexo.config,
highlightConfig = config.highlight,
highlightEnable = highlightConfig.enable,
backtickConfig = highlightConfig.backtick_code_block,
lineNumConfig = highlightConfig.line_number,
tabConfig = highlightConfig.tab_replace;

var regex = {
allOptions: /([^\s]+)\s+(.+?)\s+(https?:\/\/\S+|\/\S+)\s*(.+)?/i,
langCaption: /([^\s]+)\s*(.+)?/i
};

extend.filter.register('pre', function(data){
if (!highlightEnable) return;


data.content = data.content.replace(/ *(`{3,}|~{3,}) *([^\n]+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/g, function(match, tick, args, str){
var options = {gutter: lineNumConfig, tab: tabConfig};
indent = str.match(/^(\t*)/)[1].length,
code = [];

if (args){
if (regex.allOptions.test(args)){
var matched = args.match(regex.allOptions);
} else if (regex.langCaption.test(args)){
var matched = args.match(regex.langCaption);
}

options.lang = matched[1];
