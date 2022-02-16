'use strict';

var Schema = require('warehouse').Schema;
var util = require('hexo-util');
var slugize = util.slugize;

module.exports = function(ctx){
var Category = new Schema({
name: {type: String, required: true},
parent: {type: Schema.Types.CUID, ref: 'Category'}
