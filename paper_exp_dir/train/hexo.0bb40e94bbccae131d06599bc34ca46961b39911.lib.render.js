var renderer = require('./extend').renderer.list(),
file = require('./util').file,
async = require('async'),
path = require('path'),
_ = require('underscore');

exports.render = function(source, ext, locals, callback){
if (_.isFunction(locals)){
callback = locals;
locals = null;
