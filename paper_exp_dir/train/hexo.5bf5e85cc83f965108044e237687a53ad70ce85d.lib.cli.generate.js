var extend = require('../extend'),
route = require('../route'),
util = require('../util'),
file = util.file,
async = require('async'),
publicDir = hexo.public_dir;

extend.console.register('generate', 'Generate static files', function(args){
var ignoreTheme = (args.indexOf('-t') !== -1 || args.indexOf('--theme') !== -1),
start = new Date();

require('../generate')(ignoreTheme, function(){
var list = route.list();

console.log('Generating.');
