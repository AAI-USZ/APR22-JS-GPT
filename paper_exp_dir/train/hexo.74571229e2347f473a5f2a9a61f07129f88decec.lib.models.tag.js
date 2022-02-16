'use strict';

var Schema = require('warehouse').Schema;
var util = require('hexo-util');
var slugize = util.slugize;

module.exports = function(ctx){
var Tag = new Schema({
name: {type: String, required: true}
});
