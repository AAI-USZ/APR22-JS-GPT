


var Route = require('./route');
var Layer = require('./layer');
var methods = require('methods');
var mixin = require('utils-merge');
var debug = require('debug')('express:router');
var deprecate = require('depd')('express');
var parseUrl = require('parseurl');
var utils = require('../utils');



var objectRegExp = /^\[object (\S+)\]$/;
var slice = Array.prototype.slice;
var toString = Object.prototype.toString;



var proto = module.exports = function(options) {
options = options || {};

function router(req, res, next) {
router.handle(req, res, next);
}


router.__proto__ = proto;

router.params = {};
router._params = [];
router.caseSensitive = options.caseSensitive;
router.mergeParams = options.mergeParams;
router.strict = options.strict;
router.stack = [];

return router;
};



proto.param = function param(name, fn) {

if (typeof name === 'function') {
deprecate('router.param(fn): Refactor to use path params');
this._params.push(name);
return;
}


var params = this._params;
var len = params.length;
var ret;
