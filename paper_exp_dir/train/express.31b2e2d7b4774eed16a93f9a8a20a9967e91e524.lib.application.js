

var mixin = require('utils-merge');
var escapeHtml = require('escape-html');
var Router = require('./router');
var methods = require('methods');
var middleware = require('./middleware/init');
var query = require('./middleware/query');
var debug = require('debug')('express:application');
var View = require('./view');
var http = require('http');
var deprecate = require('./utils').deprecate;



var app = exports = module.exports = {};



app.init = function(){
this._baseRoutes = {};
this.cache = {};
this.settings = {};
this.engines = {};
this.defaultConfiguration();
};



app.defaultConfiguration = function(){

this.enable('x-powered-by');
