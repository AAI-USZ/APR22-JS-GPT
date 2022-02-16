var clc = require('cli-color'),
async = require('async'),
fs = require('graceful-fs'),
extend = require('../extend'),
util = require('../util'),
format = require('util').format,
gConfig = hexo.config;

var displayHelp = function(){
var help = [
'Example:',
'  deploy:',
'    type: rsync',
'    host: <host>',
'    user: <user>',
'    root: <root>',
