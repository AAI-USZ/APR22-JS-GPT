

var vsprintf = require('sprintf-js').vsprintf,
util = require('../../util'),
highlight = util.highlight;

var rCaptionUrlTitle = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)\s+(.+)/i,
rCaptionUrl = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)/i,
rCaption = /(\S[\S\s]*)/,
rLang = /\s*lang:(\w+)/i;


