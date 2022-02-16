var connect = require('connect'),
clc = require('cli-color'),
extend = require('../extend');

extend.console.register('server', 'Run Server', function(args){
var app = connect.createServer(),
config = hexo.config;

if (config.logger){
if (config.logger_format) app.use(connect.logger(config.logger_format));
else app.use(connect.logger());
}

app.use(connect.static(hexo.public_dir));
app.use(connect.compress());
