'use strict';

const { Schema } = require('warehouse');
const { slugize } = require('hexo-util');
const { encodeURL } = require('hexo-util');

module.exports = ctx => {
const Category = new Schema({
name: {type: String, required: true},
parent: {type: Schema.Types.CUID, ref: 'Category'}
});

Category.virtual('slug').get(function() {
let name = this.name;
