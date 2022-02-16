var extend = require('../extend'),
route = require('../route'),
util = require('../util'),
file = util.file,
async = require('async'),
fs = require('fs'),
publicDir = hexo.public_dir;

extend.console.register('generate', 'Generate static files', function(args){
var ignoreTheme = (args.indexOf('-t') !== -1 || args.indexOf('--theme') !== -1),
