




var connect = require('connect')
, Router = require('./router')
, view = require('./view')
, toArray = require('./utils').toArray
, methods = Router.methods.concat('del', 'all')
, res = require('./response')
, union = require('./utils').union
, url = require('url')
, utils = connect.utils
, path = require('path')
, extname = path.extname
, join = path.join
, fs = require('fs')
, qs = require('qs');



var app = exports = module.exports = {};



app.init = function(middleware){
var self = this;
this.cache = {};
this.settings = {};
this.engines = {};
this.redirects = {};
this.isCallbacks = {};

this.set('home', '/');
this.set('env', process.env.NODE_ENV || 'development');
this.use(connect.query());



this.locals = function(obj){
for (var key in obj) {
