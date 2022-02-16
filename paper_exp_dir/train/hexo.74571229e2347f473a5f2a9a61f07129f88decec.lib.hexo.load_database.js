'use strict';

var fs = require('hexo-fs');
var Promise = require('bluebird');

module.exports = function(ctx){
if (ctx._dbLoaded) return Promise.resolve();

var db = ctx.database;
var path = db.options.path;
