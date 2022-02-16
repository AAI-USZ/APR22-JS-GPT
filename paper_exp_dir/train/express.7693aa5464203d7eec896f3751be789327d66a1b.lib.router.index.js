

var Route = require('./route')
, Layer = require('./layer')
, methods = require('methods')
, debug = require('debug')('express:router')
, parseUrl = require('parseurl');



var proto = module.exports = function(options) {
options = options || {};

function router(req, res, next) {
router.handle(req, res, next);
}
