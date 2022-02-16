var marked = require('marked'),
_ = require('lodash'),
util = require('../../util'),
highlight = util.highlight,
htmlTag = util.html_tag;

var anchorId = function(str){
return str
.replace(/\s+/g, '_')
.replace(/\./g, '-')
.replace(/[^0-9a-zA-Z_-]/g, function(match){
return '-' + match.charCodeAt().toString(16) + '-';
})
.replace(/-{2,}/g, '-');
};

