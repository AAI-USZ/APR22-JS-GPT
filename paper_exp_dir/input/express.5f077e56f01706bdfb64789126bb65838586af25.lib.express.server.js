




var url = require('url')
, view = require('./view')
, connect = require('connect')
, utils = connect.utils
, queryString = require('querystring')
, router = require('connect').router;



var Server = exports = module.exports = function Server(middleware){
var self = this;
this.config = {};
this.settings = {};
this.redirects = {};
this.isCallbacks = {};
this.viewHelpers = {};
this.dynamicViewHelpers = {};
this.errorHandlers = [];
connect.Server.call(this, middleware || []);


this.set('home', '/');




