'use strict';

const { Schema } = require('warehouse');
const { slugize, full_url_for } = require('hexo-util');
const { hasOwnProperty: hasOwn } = Object.prototype;

module.exports = ctx => {
const Tag = new Schema({
name: {type: String, required: true}
});

Tag.virtual('slug').get(function() {
const map = ctx.config.tag_map || {};
let name = this.name;
