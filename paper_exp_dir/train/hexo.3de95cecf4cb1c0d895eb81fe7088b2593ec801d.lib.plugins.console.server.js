var connect = require('connect'),
term = require('term'),
async = require('async'),
fs = require('graceful-fs'),
extend = require('../../extend'),
publicDir = hexo.public_dir,
config = hexo.config;

extend.console.register('server', 'Run Server', function(args){
var app = connect.createServer();

if (args.p){
var port = args.p;
} else if (args.port){
