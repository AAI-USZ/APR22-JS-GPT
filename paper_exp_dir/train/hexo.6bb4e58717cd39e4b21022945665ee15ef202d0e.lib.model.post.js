var _ = require('lodash'),
async = require('async'),
model = hexo.model;

model.extend('Post', {
save: function(data, callback){
var Category = model('Category'),
Tag = model('Tag'),
self = this;

var cats = [],
