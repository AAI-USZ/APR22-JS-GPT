




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
this.routes = new Collection;
this.map = {};
this.params = {};
this._params = [];

this.middleware = function(req, res, next){
self._dispatch(req, res, next);
};
}



