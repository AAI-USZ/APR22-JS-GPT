




var path = require('path')
, extname = path.extname
, dirname = path.dirname
, basename = path.basename
, utils = require('connect').utils
, View = require('./view/view')
, partial = require('./view/partial')
, union = require('./utils').union
, merge = utils.merge
, http = require('http')
, res = http.ServerResponse.prototype;



var cache = {};



exports = module.exports = View;



exports.register = View.register;



function renderPartial(res, view, options, parentLocals, parent){
var collection, object, locals;


if (parent && !~view.indexOf('.')) {
view += parent.extension;
}

if (options) {

