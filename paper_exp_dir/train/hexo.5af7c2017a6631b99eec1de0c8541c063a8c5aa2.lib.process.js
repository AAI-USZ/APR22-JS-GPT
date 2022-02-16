var async = require('async'),
fs = require('graceful-fs'),
_ = require('lodash'),
extend = require('./extend'),
processor = extend.processor.list(),
processorLength = processor.length,
util = require('./util'),
file = util.file2,
sourceDir = hexo.source_dir,
Cache = hexo.model('Cache'),
processingFiles = {};

var getProcessor = function(path){
var tasks = [];

for (var i = 0; i < processorLength; i++){
var item = processor[i],
rule = item.rule,
params = [],
