var renderer = require('./extend').renderer.list(),
rendererSync = require('./extend').rendererSync.list(),
file = require('./util').file,
fs = require('fs'),
async = require('async'),
path = require('path'),
_ = require('underscore');

var output = function(exp, callback){
return function(){
var args = _.toArray(arguments);
args.push(exp);
callback.apply(null, args);
}
};

exports.render = function(source, ext, locals, callback){
if (_.isFunction(locals)){
