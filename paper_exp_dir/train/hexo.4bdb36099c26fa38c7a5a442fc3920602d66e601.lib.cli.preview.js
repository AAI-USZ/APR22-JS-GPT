var extend = require('../extend'),
route = require('../route'),
connect = require('connect'),
clc = require('cli-color');

extend.console.register('preview', 'Preview site', function(args){
var app = connect.createServer(),
config = hexo.config;

if (config.logger){
if (config.logger_format) app.use(connect.logger(config.logger_format));
else app.use(connect.logger());
}

require('../generate')(false, true, function(){
var list = route.list(),
