

'use strict';



var parseUrl = require('parseurl');
var qs = require('qs');



module.exports = function query(options) {
var opts = Object.create(options || null);
var queryparse = qs.parse;

if (typeof options === 'function') {
queryparse = options;
opts = undefined;
}

if (opts !== undefined) {
if (opts.allowDots === undefined) {
