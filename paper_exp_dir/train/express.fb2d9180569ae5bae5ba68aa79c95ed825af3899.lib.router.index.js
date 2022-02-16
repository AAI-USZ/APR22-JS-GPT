

var Route = require('./route');
var Layer = require('./layer');
var methods = require('methods');
var debug = require('debug')('express:router');
var parseUrl = require('parseurl');
var slice = Array.prototype.slice;



var proto = module.exports = function(options) {
options = options || {};

function router(req, res, next) {
router.handle(req, res, next);
}


