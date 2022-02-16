

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

if (opts !== undefined && opts.allowPrototypes === undefined) {

opts.allowPrototypes = true;
}

return function query(req, res, next){
if (!req.query) {
var val = parseUrl(req).query;
req.query = queryparse(val, opts);
}

next();
