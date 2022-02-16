var express = require('express'),
path = require('path'),
async = require('async'),
_ = require('lodash'),
extend = require('../../../extend'),
route = require('../../../route'),
config = hexo.config,
log = hexo.log,
publicDir = hexo.public_dir;

extend.console.register('server', 'Run server', {alias: 's'}, function(args){
var app = express(),
statics = args.s || args.static,
logFormat = args.l || args.log,
admin = args.a || args.admin,
