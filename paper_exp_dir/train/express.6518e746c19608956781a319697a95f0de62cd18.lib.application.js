



var connect = require('connect')
, Router = require('./router')
, methods = Router.methods.concat('del', 'all')
, middleware = require('./middleware')
, debug = require('debug')('express:application')
, View = require('./view')
, url = require('url')
, utils = connect.utils
, path = require('path')
, http = require('http')
, join = path.join
, fs = require('fs');



var app = exports = module.exports = {};



app.init = function(){
var self = this;
this.cache = {};
this.settings = {};
this.engines = {};
this.viewCallbacks = [];
