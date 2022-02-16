'use strict';

var urlFn = require('url');
var moment = require('moment');
var util = require('hexo-util');
var htmlTag = util.htmlTag;
var stripHTML = util.stripHTML;
var cheerio;

function meta(name, content) {
return htmlTag('meta', {
name: name,
content: content
}) + '\n';
}

function og(name, content) {
return htmlTag('meta', {
property: name,
content: content
}) + '\n';
}

function openGraphHelper(options) {
options = options || {};

if (!cheerio) cheerio = require('cheerio');

var page = this.page;
var config = this.config;
var content = page.content;
