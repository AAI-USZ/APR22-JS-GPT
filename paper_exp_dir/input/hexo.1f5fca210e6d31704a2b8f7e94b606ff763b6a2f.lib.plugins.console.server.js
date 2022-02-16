term = require('term'),
async = require('async'),
fs = require('graceful-fs'),
extend = require('../../extend'),
publicDir = hexo.public_dir,
config = hexo.config;

extend.console.register('server', 'Run Server', function(args){

if (args.p){
var port = args.p;
} else if (args.port){
var port = args.port;
} else {
var port = config.port;
}

if (config.logger){
