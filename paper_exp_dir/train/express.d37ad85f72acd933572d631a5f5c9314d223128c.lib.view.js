




var path = require('path')
, extname = path.extname
, dirname = path.dirname
, basename = path.basename
, utils = require('connect').utils
, clone = require('./utils').clone
, View = require('./view/view')
, Partial = require('./view/partial')
, merge = utils.merge
, http = require('http');



var cache = {};



exports = module.exports = View;
exports.Partial = Partial;



exports.register = View.register;



http.ServerResponse.prototype.partial = function(view, options, locals, parent){
