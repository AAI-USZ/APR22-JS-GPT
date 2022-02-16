var async = require('async'),
fs = require('graceful-fs'),
_ = require('lodash'),
pathFn = require('path'),
util = require('../../../util'),
file = util.file2,
Pool = util.pool,
HexoError = require('../../../error');

var log = hexo.log,
config = hexo.config,
route = hexo.route,
publicDir = hexo.public_dir,
sourceDir = hexo.source_dir;

module.exports = function(args, callback){
var watchOption = args.w || args.watch,
start = Date.now(),
cache = {};

if (config.multi_thread){
var workerPath = require.resolve('./worker');

if (config.multi_thread === true){
var q = new Pool(workerPath);
} else {
