

var extend = hexo.extend,
highlight = hexo.util.highlight,
config = hexo.config,
highlightConfig = config.highlight,
lineNumConfig = highlightConfig.line_number,
tabConfig = highlightConfig.tab_replace,
fs = require('fs'),
hexofs = hexo.util.file,
path = require("path");

var code_prefix = '/downloads/code',
code_path = path.join(hexo.source_dir, config.code_dir);

var regex = {
captionTitleFile:/(.*)?(\s+|^)(\/*\S+)/i,
lang: /\s*lang:(\w+)/i
};

extend.tag.register('include_code', function(args, content) {
var args = args.join(' ');
