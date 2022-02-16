




var sys = require('sys'),
url = require('url'),
view = require('./view'),
connect = require('connect'),
queryString = require('querystring'),
router = require('connect/middleware/router');



var Server = exports = module.exports = function Server(middleware){
var self = this;
this.config = {};
this.settings = {};
this.redirects = {};
connect.Server.call(this, middleware || []);


this.use('/', function(req, res, next){
req.params = req.params || {};
req.params.get = {};
res.headers = {};
req.app = res.app = self;
req.res = res;
res.req = req;
