




var sys = require('sys'),
url = require('url'),
view = require('./view'),
connect = require('connect'),
utils = require('connect/utils'),
queryString = require('querystring'),
router = require('connect/middleware/router');



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


this.set('env',
process.env.EXPRESS_ENV ||
process.connectEnv.name);


this.use(function(req, res, next){