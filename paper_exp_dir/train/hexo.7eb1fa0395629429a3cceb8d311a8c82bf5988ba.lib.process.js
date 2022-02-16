var async = require('async'),
fs = require('graceful-fs'),
_ = require('lodash'),
extend = require('./extend'),
processor = extend.processor.list(),
processorLength = processor.length,
sourceDir = hexo.source_dir,
EOL = require('os').EOL,
EOLre = new RegExp(EOL, 'g');

var getProcessor = function(path){
var tasks = [];

