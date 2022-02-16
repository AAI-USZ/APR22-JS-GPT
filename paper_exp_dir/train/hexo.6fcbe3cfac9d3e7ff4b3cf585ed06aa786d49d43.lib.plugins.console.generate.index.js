var async = require('async'),
fs = require('graceful-fs'),
_ = require('lodash'),
extend = require('../../../extend'),
call = require('../../../call'),
util = require('../../../util'),
file = util.file2,
Pool = util.thread_pool,
route = require('../../../route'),
HexoError = require('../../../error'),
log = hexo.log,
config = hexo.config,
publicDir = hexo.public_dir,
sourceDir = hexo.source_dir;

extend.console.register('generate', 'Generate static files', {alias: 'g'}, function(args, callback){
var watch = !!(args.w || args.watch),
deploy = !!(args.d || args.deploy),
start = Date.now(),
pool = new Pool(require.resolve('./worker')),
cache = {};

var pushCallback = function(err){
var item = this.data,
