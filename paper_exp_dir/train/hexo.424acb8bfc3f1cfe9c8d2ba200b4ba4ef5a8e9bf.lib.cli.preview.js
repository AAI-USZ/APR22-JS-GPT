var extend = require('../extend'),
route = require('../route'),
connect = require('connect'),
clc = require('cli-color'),
mime = require('mime'),
url = require('url'),
watchTree = require('fs-watch-tree').watchTree,
sourceDir = hexo.source_dir;

extend.console.register('preview', 'Preview site', function(args){
var app = connect.createServer(),
config = hexo.config,
generate = require('../generate');

if (config.logger){
