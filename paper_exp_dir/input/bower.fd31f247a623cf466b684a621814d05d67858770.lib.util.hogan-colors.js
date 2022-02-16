







var colors = require('colors');
var hogan  = require('hogan.js');
var _      = require('lodash');

module.exports = hogan.Template.prototype.renderWithColors = function (context, partials, indent) {
context = _.extend({
