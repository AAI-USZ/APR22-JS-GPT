'use strict';

var common = require('./common');
var Promise = require('bluebird');
var yfm = require('hexo-front-matter');
var pathFn = require('path');
var util = require('hexo-util');
var Pattern = util.Pattern;

module.exports = function(ctx) {
function processPage(file) {
var Page = ctx.model('Page');
var path = file.path;
var doc = Page.findOne({source: path});
var config = ctx.config;
var timezone = config.timezone;

if (file.type === 'skip' && doc) {
return;
}

if (file.type === 'delete') {
if (doc) {
return doc.remove();
}

return;
