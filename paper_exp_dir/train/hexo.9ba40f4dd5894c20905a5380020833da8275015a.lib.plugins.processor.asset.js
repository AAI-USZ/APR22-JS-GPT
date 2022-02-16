'use strict';

var common = require('./common');
var Promise = require('bluebird');
var yfm = require('hexo-front-matter');
var pathFn = require('path');

exports.process = function(file) {
if (this.render.isRenderable(file.path)) {
return processPage.call(this, file);
}

return processAsset.call(this, file);
};

exports.pattern = common.ignoreTmpAndHiddenFile;

function processPage(file) {
var Page = this.model('Page');
var path = file.path;
var doc = Page.findOne({source: path});
var self = this;
var config = this.config;
var timezone = config.timezone;

if (file.type === 'delete') {
if (doc) {
return doc.remove();
