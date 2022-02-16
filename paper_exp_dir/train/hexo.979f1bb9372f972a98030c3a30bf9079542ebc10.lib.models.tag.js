'use strict';

var Schema = require('warehouse').Schema;
var util = require('hexo-util');
var slugize = util.slugize;
var hasOwn = Object.prototype.hasOwnProperty;

module.exports = function(ctx) {
var Tag = new Schema({
name: {type: String, required: true}
});

Tag.virtual('slug').get(function() {
var map = ctx.config.tag_map || {};
var name = this.name;
