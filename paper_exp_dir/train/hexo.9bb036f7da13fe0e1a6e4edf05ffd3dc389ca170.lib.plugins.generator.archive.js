var paginator = require('./paginator'),
extend = require('../../extend'),
config = hexo.config,
mode = config.archive,
archiveDir = config.archive_dir + '/';

extend.generator.register(function(locals, render, callback){
if (!mode){
if (mode == 0 || mode === false){
return callback();
} else {
mode = 2;
