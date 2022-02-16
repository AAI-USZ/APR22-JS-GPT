var extend = require('../extend'),
route = require('../route'),
connect = require('connect'),
clc = require('cli-color'),
mime = require('mime'),
url = require('url'),
watch = require('../watch');

extend.console.register('preview', 'Preview site', function(args){
var app = connect.createServer(),
config = hexo.config,
generate = require('../generate');

if (config.logger){
if (config.logger_format) app.use(connect.logger(config.logger_format));
else app.use(connect.logger());
