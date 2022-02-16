

var extend = require('../extend'),
highlight = require('../util').highlight;

var regex = {
captionUrlTitle: /(\S[\S\s]*)\s+(https?:\/\/)(\S+)\s+(.+)/i,
captionUrl: /(\S[\S\s]*)\s+(https?:\/\/)(\S+)/i,
caption: /(\S[\S\s]*)/,
lang: /\s*lang:(\w+)/i
};

