var async = require('async'),
moment = require('moment'),
fs = require('graceful-fs'),
pathFn = require('path'),
_ = require('lodash'),
url = require('url'),
util = require('../../util'),
yfm = util.yfm,
escape = util.escape,
Permalink = util.permalink,
file = util.file2;

var rBasename = /((.*)\/)?([^\/]+)\.(\w+)$/,
regex = require('./index').regex,
preservedKeys = ['title', 'year', 'month', 'day', 'i_month', 'i_day'],
permalink;

var scanAssetDir = function(post, callback){
var assetDir = post.asset_dir,
