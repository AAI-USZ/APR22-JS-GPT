var util = require('../../util'),
highlight = util.highlight;

var rBacktick = / *(`{3,}|~{3,}) *([^\n]+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/g,
rAllOptions = /([^\s]+)\s+(.+?)\s+(https?:\/\/\S+|\/\S+)\s*(.+)?/i,
rLangCaption = /([^\s]+)\s*(.+)?/i;

module.exports = function(data){
var config = hexo.config.highlight;

if (!config || !config.enable) return;
