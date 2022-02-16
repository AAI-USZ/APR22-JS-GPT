'use strict';

const { Schema } = require('warehouse');
const { slugize } = require('hexo-util');
const { hasOwnProperty: hasOwn } = Object.prototype;
const { encodeURL } = require('hexo-util');

module.exports = ctx => {
const Tag = new Schema({
name: {type: String, required: true}
});

Tag.virtual('slug').get(function() {
const map = ctx.config.tag_map || {};
let name = this.name;
