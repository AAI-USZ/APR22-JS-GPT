


var utils = require('../utils')
, debug = require('debug')('express:router:route')
, methods = require('methods')



module.exports = Route;



function Route(path, options) {
debug('new %s', path);
options = options || {};
