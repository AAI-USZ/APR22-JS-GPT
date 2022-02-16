'use strict';

const { Schema } = require('warehouse');
const { slugize } = require('hexo-util');
const hasOwn = Object.prototype.hasOwnProperty;

module.exports = ctx => {
const Tag = new Schema({
name: {type: String, required: true}
});

Tag.virtual('slug').get(function() {
const map = ctx.config.tag_map || {};
