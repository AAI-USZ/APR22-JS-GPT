




var connect = require('connect')
, Router = require('./router')
, toArray = require('./utils').toArray
, methods = Router.methods.concat('del', 'all')
, res = require('./response')
, View = require('./view')
, url = require('url')
, utils = connect.utils
, path = require('path')
, join = path.join
, fs = require('fs')
, qs = require('qs');



var app = exports = module.exports = {};



app.init = function(){
var self = this;
this.cache = {};
this.settings = {};
this.engines = {};
this.redirects = {};
this.isCallbacks = {};
this.defaultConfiguration();


methods.forEach(function(method){
self.lookup[method] = function(path){
return self.routes.lookup(method, path);
};

self.match[method] = function(path){
return self.routes.match(method, path);
};
