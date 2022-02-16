'use strict';

var urlFn = require('url');
var moment = require('moment');
var util = require('hexo-util');
var htmlTag = util.htmlTag;
var stripHTML = util.stripHTML;
var cheerio;

function meta(name, content){
return htmlTag('meta', {
name: name,
