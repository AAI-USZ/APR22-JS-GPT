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
const map = ctx.config.category_map || {};
let name = this.name;
let str = '';

if (!name) return;

if (this.parent) {
const parent = ctx.model('Category').findById(this.parent);
str += `${parent.slug}/`;
