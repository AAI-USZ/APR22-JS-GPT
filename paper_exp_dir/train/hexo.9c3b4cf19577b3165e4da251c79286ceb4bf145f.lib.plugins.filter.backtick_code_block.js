var stripIndent = require('strip-indent'),
util = require('../../util'),
highlight = util.highlight;

var rBacktick = /(`{3,}|~{3,}) *(.+)? *\n([\s\S]+?)\s*\1/g,
rAllOptions = /([^\s]+)\s+(.+?)\s+(https?:\/\/\S+|\/\S+)\s*(.+)?/i,
rLangCaption = /([^\s]+)\s*(.+)?/i;

module.exports = function(data, callback){
var config = hexo.config.highlight || {};
