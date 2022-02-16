

'use strict';



var merge = require('utils-merge')
var parseUrl = require('parseurl');
var qs = require('qs');



module.exports = function query(options) {
var opts = merge({}, options)
var queryparse = qs.parse;

if (typeof options === 'function') {
queryparse = options;
