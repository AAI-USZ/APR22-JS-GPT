var fs = require('graceful-fs'),
moment = require('moment'),
path = require('path'),
_ = require('lodash'),
util = require('../../util'),
escape = util.escape,
Permalink = util.permalink,
permalink;

var reservedKeys = ['year', 'month', 'i_month', 'day', 'i_day', 'title'];

module.exports = function(data, replace, callback){
var sourceDir = hexo.source_dir,
