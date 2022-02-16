

var Route = require('./route')
, Layer = require('./layer')
, utils = require('../utils')
, methods = require('methods')
, debug = require('debug')('express:router')
, parseUrl = utils.parseUrl;



var proto = module.exports = function(options) {
options = options || {};

function router(req, res, next) {
router.handle(req, res, next);
};


router.__proto__ = proto;

router.params = {};
router._params = [];
