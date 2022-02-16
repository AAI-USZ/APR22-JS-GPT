var _ = require('lodash'),
util = require('../../util'),
htmlTag = util.html_tag,
format = util.format;

var rCover = /<img([\s\S]*?)src="(.+?)"([\s\S]*?)>/;

var metaTag = function(name, content){
var namespace = name.split(':')[0],
data = {};

if (namespace === 'og' || namespace === 'fb'){
data.property = name;
} else {
data.name = name;
}

data.content = content;

return htmlTag('meta', data);
