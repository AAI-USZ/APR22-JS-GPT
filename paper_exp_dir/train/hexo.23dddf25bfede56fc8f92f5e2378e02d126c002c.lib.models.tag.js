'use strict';

var Schema = require('warehouse').Schema;
var util = require('hexo-util');
var slugize = util.slugize;
var hasOwn = Object.prototype.hasOwnProperty;

module.exports = function(ctx) {
var Tag = new Schema({
name: {type: String, required: true}
});

Tag.virtual('slug').get(function() {
var map = ctx.config.tag_map || {};
var name = this.name;
if (!name) return;

if (hasOwn.call(map, name)) {
name = map[name] || name;
}

return slugize(name, {transform: ctx.config.filename_case});
});

Tag.virtual('path').get(function() {
var tagDir = ctx.config.tag_dir;
if (tagDir[tagDir.length - 1] !== '/') tagDir += '/';

return tagDir + this.slug + '/';
