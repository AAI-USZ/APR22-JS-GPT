




var url = require('url')
, view = require('./view')
, connect = require('connect')
, utils = connect.utils
, queryString = require('querystring')
, router = require('connect').router
, methods = router.methods.concat(['del', 'all']);



var Server = exports = module.exports = function Server(middleware){
var self = this;
this.settings = {};
this.redirects = {};
this.isCallbacks = {};
this.viewHelpers = {};
this.dynamicViewHelpers = {};
this.errorHandlers = [];
connect.Server.call(this, []);


this.set('home', '/');

