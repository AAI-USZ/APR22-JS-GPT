

var extend = require('../extend'),
highlight = require('../util').highlight,
config = hexo.config,
highlightConfig = config.highlight,
lineNumConfig = highlightConfig ? highlightConfig.line_number : true;

var regex = {
captionUrlTitle: /(\S[\S\s]*)\s+(https?:\/\/)(\S+)\s+(.+)/i,
captionUrl: /(\S[\S\s]*)\s+(https?:\/\/)(\S+)/i,
caption: /(\S[\S\s]*)/,
lang: /\s*lang:(\w+)/i
