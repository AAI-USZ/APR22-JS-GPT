'use strict';

const Schema = require('warehouse').Schema;
const util = require('hexo-util');
const slugize = util.slugize;
const hasOwn = Object.prototype.hasOwnProperty;

module.exports = ctx => {
const Tag = new Schema({
name: {type: String, required: true}
});

Tag.virtual('slug').get(function() {
const map = ctx.config.tag_map || {};
let name = this.name;
if (!name) return;

if (hasOwn.call(map, name)) {
name = map[name] || name;
}

return slugize(name, {transform: ctx.config.filename_case});
});

Tag.virtual('path').get(function() {
let tagDir = ctx.config.tag_dir;
if (tagDir[tagDir.length - 1] !== '/') tagDir += '/';

return `${tagDir + this.slug}/`;
