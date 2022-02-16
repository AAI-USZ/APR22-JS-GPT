'use strict';

var Schema = require('warehouse').Schema;
var util = require('hexo-util');
var slugize = util.slugize;

module.exports = function(ctx) {
var Category = new Schema({
name: {type: String, required: true},
parent: {type: Schema.Types.CUID, ref: 'Category'}
});

Category.virtual('slug').get(function() {
var map = ctx.config.category_map || {};
var name = this.name;
var str = '';

if (!name) return;

if (this.parent) {
var parent = ctx.model('Category').findById(this.parent);
str += parent.slug + '/';
}

name = map[name] || name;
str += slugize(name, {transform: ctx.config.filename_case});

return str;
});

Category.virtual('path').get(function() {
var catDir = ctx.config.category_dir;
if (catDir === '/') catDir = '';
if (catDir.length && catDir[catDir.length - 1] !== '/') catDir += '/';

return catDir + this.slug + '/';
});

Category.virtual('permalink').get(function() {
return ctx.config.url + '/' + this.path;
});

