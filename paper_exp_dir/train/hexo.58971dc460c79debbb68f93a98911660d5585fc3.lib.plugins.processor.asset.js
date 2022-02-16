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

if (file.type === 'delete') {
if (doc) {
return doc.remove();
}

return;
}

return file.changed().then(function(changed) {
if (!changed && doc) return;

return Promise.all([
file.stat(),
file.read()
]).spread(function(stats, content) {
var data = yfm(content);
var output = ctx.render.getOutput(path);

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
} else {
data.updated = stats.mtime;
}

if (data.permalink) {
data.path = data.permalink;
delete data.permalink;

if (data.path[data.path.length - 1] === '/') {
data.path += 'index';
}

if (!pathFn.extname(data.path)) {
data.path += '.' + output;
}
} else {
var extname = pathFn.extname(path);
data.path = path.substring(0, path.length - extname.length) + '.' + output;
}

if (!data.layout && output !== 'html' && output !== 'htm') {
data.layout = false;
}



var doc = Page.findOne({source: path});

if (doc) {
return doc.replace(data);
}

return Page.insert(data);
});
});
}

function processAsset(file) {
var id = file.source.substring(ctx.base_dir.length).replace(/\\/g, '/');
var Asset = ctx.model('Asset');
var doc = Asset.findById(id);

if (file.type === 'delete') {
if (doc) {
return doc.remove();
}

return;
}

return file.changed().then(function(changed) {
return Asset.save({
_id: id,
path: file.path,
modified: changed,
renderable: file.params.renderable
});
});
}

return {
pattern: new Pattern(function(path) {
if (common.isTmpFile(path) || common.isMatch(path, ctx.config.exclude)) return;

if (common.isHiddenFile(path) && !common.isMatch(path, ctx.config.include)) {
