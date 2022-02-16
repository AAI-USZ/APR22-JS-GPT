




var extname = require('path').extname
, dirname = require('path').dirname
, basename = require('path').basename
, utils = require('connect').utils
, clone = require('./utils').clone
, View = require('./view/view')
, Partial = require('./view/partial')
, merge = utils.merge
, http = require('http')
, mime = utils.mime;



var cache = {};



exports = module.exports = View;
exports.Partial = Partial;
