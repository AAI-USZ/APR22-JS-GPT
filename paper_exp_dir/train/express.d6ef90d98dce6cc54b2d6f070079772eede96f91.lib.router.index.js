




var Route = require('./route')
, Collection = require('./collection')
, utils = require('../utils')
, parse = require('url').parse
, toArray = utils.toArray;



exports = module.exports = Router;



var methods = exports.methods = require('./methods');



function Router(app) {
var self = this;
this.app = app;
this.routes = {};
this.params = {};
this.middleware = function(req, res, next){
self._dispatch(req, res, next);
};
}



Router.prototype.param = function(name, fn){
var callback = fn;

if (fn.length < 3) {
fn = function(req, res, next){
var val = req.params[name];
val = req.params[name] = callback(val);
if (invalidParamReturnValue(val)) {
next('route');
} else {
next();
