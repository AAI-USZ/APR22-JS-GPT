var connect = require('connect'),
extend = require('../extend');

extend.console.register('server', 'Run Server', function(args){
var app = connect.createServer(),
