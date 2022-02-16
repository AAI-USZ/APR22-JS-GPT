var connect = require('connect'),
colors = require('colors'),
extend = require('../extend');

extend.console.register('server', 'Run Server', function(args){
var app = connect.createServer(),
config = hexo.config;

