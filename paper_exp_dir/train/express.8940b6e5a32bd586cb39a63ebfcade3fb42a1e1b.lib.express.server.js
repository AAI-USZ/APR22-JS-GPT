




var url = require('url')
, view = require('./view')
, connect = require('connect')
, utils = connect.utils
, queryString = require('querystring')
, router = require('connect/middleware/router');



var Server = exports = module.exports = function Server(middleware){
var self = this;
this.config = {};
this.settings = {};
this.redirects = {};
this.viewHelpers = {};
this.dynamicViewHelpers = {};
this.errorHandlers = [];
connect.Server.call(this, middleware || []);


this.set('home', '/');


if (process.env.EXPRESS_ENV) {
process.env.NODE_ENV = process.env.EXPRESS_ENV;
console.warn('\x1b[33mWarning\x1b[0m: EXPRESS_ENV is deprecated, use NODE_ENV.');
}


this.showVersion = false;


this.set('env', process.env.NODE_ENV || 'development');


this.use(function(req, res, next){
req.query = {};
res.headers = { 'X-Powered-By': 'Express' };
req.app = res.app = self;
req.res = res;
res.req = req;
