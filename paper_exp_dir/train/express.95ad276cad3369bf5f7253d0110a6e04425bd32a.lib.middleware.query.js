



var parseUrl = require('parseurl');
var qs = require('qs');



module.exports = function query(options) {
var queryparse = qs.parse;

if (typeof options === 'function') {
