var render = require('./extend').renderer.list(),
renderSync = require('./extend').rendererSync.list(),
fs = require('fs'),
async = require('async'),
path = require('path'),
_ = require('underscore');

exports.render = function(source, ext, locals, callback){
if (_.isFunction(locals)){
callback = locals;
locals = null;
}
