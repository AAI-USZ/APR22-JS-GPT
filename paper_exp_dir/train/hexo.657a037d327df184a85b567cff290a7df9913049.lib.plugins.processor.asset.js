'use strict';

const { timezone, toDate, isExcludedFile, isMatch } = require('./common');
const Promise = require('bluebird');
const yfm = require('hexo-front-matter');
const { extname, relative } = require('path');
const { Pattern } = require('hexo-util');

module.exports = ctx => {
function processPage(file) {
const Page = ctx.model('Page');
const { path } = file;
const doc = Page.findOne({source: path});
const { config } = ctx;
const { timezone: timezoneCfg } = config;

const updated_option = config.use_date_for_updated === true ? 'date' : config.updated_option;

if (file.type === 'skip' && doc) {
return;
}

if (file.type === 'delete') {
if (doc) {
return doc.remove();
