'use strict';

const { Schema } = require('warehouse');
const { slugize } = require('hexo-util');
const { hasOwnProperty: hasOwn } = Object.prototype;

module.exports = ctx => {
const Tag = new Schema({
name: {type: String, required: true}
});

Tag.virtual('slug').get(function() {
const map = ctx.config.tag_map || {};
let name = this.name;
if (!name) return;

if (Reflect.apply(hasOwn, map, [name])) {
name = map[name] || name;
}

return slugize(name, {transform: ctx.config.filename_case});
});

Tag.virtual('path').get(function() {
let tagDir = ctx.config.tag_dir;
if (tagDir[tagDir.length - 1] !== '/') tagDir += '/';

return `${tagDir + this.slug}/`;
});

Tag.virtual('permalink').get(function() {
