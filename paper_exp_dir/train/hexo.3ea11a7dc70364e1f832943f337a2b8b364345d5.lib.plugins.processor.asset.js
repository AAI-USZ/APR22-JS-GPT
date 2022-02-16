var common = require('./common');
var Promise = require('bluebird');
var yfm = require('hexo-front-matter');
var pathFn = require('path');

exports.process = function(file){
if (this.render.isRenderable(file.path)){
return processPage.call(this, file);
} else {
return processAsset.call(this, file);
}
};

exports.pattern = common.ignoreTmpAndHiddenFile;

function processPage(file){
var Page = this.model('Page');
var path = file.path;
var doc = Page.findOne({source: path});
var self = this;

if (file.type === 'skip' && doc){
return;
}

if (file.type === 'delete'){
if (doc){
return doc.remove();
} else {
return;
}
}

return Promise.all([
file.stat(),
file.read()
]).spread(function(stats, content){
var data = yfm(content);
var output = self.render.getOutput(path);

data.source = path;
data.raw = content;

data.date = common.toDate(data.date) || stats.ctime;
data.updated = common.toDate(data.updated) || stats.mtime;

if (data.permalink){
data.path = data.permalink;
delete data.permalink;

