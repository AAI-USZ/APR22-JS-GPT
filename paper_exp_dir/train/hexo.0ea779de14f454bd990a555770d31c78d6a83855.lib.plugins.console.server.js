var express = require('express'),
term = require('term'),
path = require('path'),
async = require('async'),
fs = require('graceful-fs'),
_ = require('lodash'),
extend = require('../../extend'),
route = require('../../route'),
config = hexo.config,
publicDir = hexo.public_dir;

var randomPass = function(length){
var text = '0123456789abcdefghijklmnopqrstuvwxyz',
total = text.length,
result = '';

for (var i=0; i<length; i++){
result += text.substr(parseInt(Math.random() * total), 1);
}

return result;
};

extend.console.register('server', 'Run server', function(args){
var app = express(),

admin = false,
statics = args.s || args.static ? true : false,
log = args.l || args.log,
port = args.p || args.port || config.port,
generate = require('../../generate');

app.set('views', hexo.core_dir + 'views');
app.set('view engine', 'ejs');
app.locals.config = config;
app.locals.version = hexo.version;


app.engine('ejs', require('../../render').renderFile);
