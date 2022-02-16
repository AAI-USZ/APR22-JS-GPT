var cheerio = require('cheerio');
var util = require('hexo-util');
var htmlTag = util.htmlTag;
var stripHTML = util.stripHTML;

function meta(name, content){
return htmlTag('meta', {
name: name,
content: content
}) + '\n';
}

