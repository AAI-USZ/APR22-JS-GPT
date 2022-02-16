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

if (file.type === 'skip' && doc) {
return;
}

if (file.type === 'delete') {
if (doc) {
return doc.remove();
}

return;
}

return Promise.all([
file.stat(),
file.read()
]).spread((stats, content) => {
const data = yfm(content);
const output = ctx.render.getOutput(path);

data.source = path;
data.raw = content;

data.date = toDate(data.date);

if (data.date) {
if (timezoneCfg) data.date = timezone(data.date, timezoneCfg);
} else {
data.date = stats.ctime;
}

data.updated = toDate(data.updated);

if (data.updated) {
if (timezoneCfg) data.updated = timezone(data.updated, timezoneCfg);
data.updated = data.date;
