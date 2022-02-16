var _ = require('lodash'),
cheerio = require('cheerio'),
util = require('../../util'),
htmlTag = util.html_tag,
format = util.format;

var metaTag = function(name, content){
var data = {};

switch (name.split(':')[0]){
case 'og':
case 'fb':
data.property = name;
break;

default:
data.name = name;
