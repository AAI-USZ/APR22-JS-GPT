




var Route = require('./route')
, Collection = require('./collection')
, utils = require('../utils')
, parse = require('url').parse;



exports = module.exports = Router;



var methods = exports.methods = require('./methods');



function Router(options) {
options = options || {};
var self = this;
this.routes = new Collection;
this.map = {};
this.params = {};
this._params = [];
this.caseSensitive = options.caseSensitive;
this.strict = options.strict;

this.middleware = function(req, res, next){
self._dispatch(req, res, next);
};
}
