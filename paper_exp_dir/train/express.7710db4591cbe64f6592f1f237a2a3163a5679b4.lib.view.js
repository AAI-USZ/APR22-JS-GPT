




var path = require('path')
, extname = path.extname
, join = path.join
, utils = require('connect').utils
, union = require('./utils').union
, merge = utils.merge
, http = require('http')
, fs = require('fs')
, res = http.ServerResponse.prototype;



res.render = function(view, opts, fn){
