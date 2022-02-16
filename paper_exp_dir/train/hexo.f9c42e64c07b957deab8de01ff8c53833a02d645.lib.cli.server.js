var connect = require('connect'),
clc = require('cli-color'),
extend = require('../extend');

extend.console.register('server', 'Run Server', function(args){
var app = connect.createServer(),
config = hexo.config;

app.use(connect.static(hexo.public_dir));
app.use(connect.staticCache());
app.use(connect.compress());
