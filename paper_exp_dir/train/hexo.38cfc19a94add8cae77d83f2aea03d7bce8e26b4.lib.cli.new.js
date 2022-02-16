var moment = require('moment'),
clc = require('cli-color'),
fs = require('graceful-fs'),
path = require('path'),
sep = path.sep,
extend = require('../extend'),
util = require('../util'),
file = util.file;

extend.console.register('new_post', 'Create a new post', function(args){
var slug = args[0];

if (slug === undefined){
