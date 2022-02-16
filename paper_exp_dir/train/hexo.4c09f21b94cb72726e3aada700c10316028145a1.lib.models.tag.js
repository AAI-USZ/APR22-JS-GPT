'use strict';

const { Schema } = require('warehouse');
const { slugize } = require('hexo-util');
const { hasOwnProperty: hasOwn } = Object.prototype;
const full_url_for = require('../plugins/helper/full_url_for');

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
return full_url_for.call(ctx, this.path);
});

Tag.virtual('posts').get(function() {
const PostTag = ctx.model('PostTag');

const ids = PostTag.find({tag_id: this._id}).map(item => item.post_id);

return ctx.locals.get('posts').find({
_id: {$in: ids}
});
