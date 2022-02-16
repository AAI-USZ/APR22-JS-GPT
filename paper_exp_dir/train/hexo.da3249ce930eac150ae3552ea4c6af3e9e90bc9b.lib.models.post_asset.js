'use strict';

const Schema = require('warehouse').Schema;
const pathFn = require('path');

module.exports = ctx => {
const PostAsset = new Schema({
_id: {type: String, required: true},
slug: {type: String, required: true},
modified: {type: Boolean, default: true},
post: {type: Schema.Types.CUID, ref: 'Post'},
renderable: {type: Boolean, default: true}
});

