var render = require('./extend').renderer.list(),
renderSync = require('./extend').rendererSync.list(),
async = require('async'),
path = require('path'),
_ = require('underscore'),
util = require('./util'),
file = util.file;

exports.render = function(source, ext, locals, callback){
if (_.isFunction(locals)){
callback = locals;
locals = null;
