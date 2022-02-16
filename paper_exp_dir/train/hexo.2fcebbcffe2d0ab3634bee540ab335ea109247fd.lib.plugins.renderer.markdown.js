var marked = require('marked'),
_ = require('lodash'),
util = require('../../util'),
highlight = util.highlight,
htmlTag = util.html_tag,
headingId = {};

var anchorId = function(str){
return str
.replace(/\s+/g, '_')
.replace(/\./g, '-')
.replace(/-{2,}/g, '-');
};

