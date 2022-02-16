var async = require('async'),
_ = require('underscore'),
fs = require('graceful-fs'),
extend = require('./extend'),
processor = extend.processor.list(),
sourceDir = hexo.source_dir,
EOL = require('os').EOL,
EOLre = new RegExp(EOL, 'g');

module.exports = function(files, callback){
if (!_.isArray(files)) files = [files];

