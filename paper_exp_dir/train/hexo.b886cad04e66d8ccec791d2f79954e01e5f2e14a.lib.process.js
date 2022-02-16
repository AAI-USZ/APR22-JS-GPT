var async = require('async'),
_ = require('underscore'),
fs = require('graceful-fs'),
extend = require('./extend'),
processor = extend.processor.list(),
sourceDir = hexo.source_dir,
EOL = require('os').EOL,
EOLre = new RegExp(EOL, 'g');

var getProcessor = function(path){
var tasks = [];

processor.forEach(function(item){
var rule = item.rule,
match = false,
params = [];

var obj = {
fn: item,
rule: item.rule
};
