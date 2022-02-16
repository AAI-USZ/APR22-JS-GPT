'use strict';

const Schema = require('warehouse').Schema;
const util = require('hexo-util');
const slugize = util.slugize;

module.exports = ctx => {
const Category = new Schema({
name: {type: String, required: true},
parent: {type: Schema.Types.CUID, ref: 'Category'}
});

Category.virtual('slug').get(function() {
let name = this.name;

if (!name) return;

let str = '';

if (this.parent) {
const parent = ctx.model('Category').findById(this.parent);
str += `${parent.slug}/`;
}

const map = ctx.config.category_map || {};

name = map[name] || name;
str += slugize(name, {transform: ctx.config.filename_case});

return str;
