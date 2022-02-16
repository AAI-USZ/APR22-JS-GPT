

var util = require('hexo-util');
var titlecase = util.titlecase;

var rFullCiteWithTitle = /(\S.*)\s+(https?:\/\/)(\S+)\s+(.+)/i;
var rFullCite = /(\S.*)\s+(https?:\/\/)(\S+)/i;
var rAuthorTitle = /([^,]+),\s*([^,]+)/;
var rAuthor = /(.+)/;



var str = args.join(' ');
var author = '';
var source = '';
var title = '';
var footer = '';
