

var finalhandler = require('finalhandler');
var mixin = require('utils-merge');
var Router = require('./router');
var methods = require('methods');
var middleware = require('./middleware/init');
var query = require('./middleware/query');
var debug = require('debug')('express:application');
var View = require('./view');
var http = require('http');
var compileETag = require('./utils').compileETag;
var compileQueryParser = require('./utils').compileQueryParser;
var compileTrust = require('./utils').compileTrust;
var deprecate = require('depd')('express');
var resolve = require('path').resolve;



var app = exports = module.exports = {};



app.init = function(){
this.cache = {};
this.settings = {};
