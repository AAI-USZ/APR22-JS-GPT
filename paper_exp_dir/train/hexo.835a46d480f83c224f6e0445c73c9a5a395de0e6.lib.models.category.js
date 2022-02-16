'use strict';

const { Schema } = require('warehouse');
const { slugize } = require('hexo-util');

module.exports = ctx => {
const Category = new Schema({
name: {type: String, required: true},
parent: {type: Schema.Types.CUID, ref: 'Category'}
});

Category.virtual('slug').get(function() {
const map = ctx.config.category_map || {};
