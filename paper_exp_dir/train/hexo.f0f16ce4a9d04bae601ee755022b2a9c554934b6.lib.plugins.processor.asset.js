'use strict';

const common = require('./common');
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
const { timezone, use_date_for_updated } = config;

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

data.date = common.toDate(data.date);

if (data.date) {
if (timezone) data.date = common.timezone(data.date, timezone);
} else {
data.date = stats.ctime;
}

data.updated = common.toDate(data.updated);

if (data.updated) {
if (timezone) data.updated = common.timezone(data.updated, timezone);
} else if (use_date_for_updated) {
data.updated = data.date;
} else {
data.updated = stats.mtime;
}

if (data.permalink) {
data.path = data.permalink;
delete data.permalink;

