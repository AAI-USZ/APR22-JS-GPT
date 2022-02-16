




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
connect.Server.call(this, middleware || []);
