

var parseUrl = require('parseurl');
var qs = require('qs');



module.exports = function query(options) {
var queryparse = qs.parse;

if (typeof options === 'function') {
queryparse = options;
options = undefined;
}

return function query(req, res, next){
if (!req.query) {
