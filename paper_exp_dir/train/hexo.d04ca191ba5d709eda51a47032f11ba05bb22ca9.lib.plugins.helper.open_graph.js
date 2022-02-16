var _ = require('lodash'),
cheerio = require('cheerio'),
util = require('../../util'),
htmlTag = util.html_tag,
format = util.format;

var metaTag = function(name, content){
var namespace = name.split(':')[0],
data = {};

if (namespace === 'og' || namespace === 'fb'){
