var express = require('express'),
term = require('term'),
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
statics = args.s || args.static ? true : false,
logFormat = args.l || args.log,
port = args.p || args.port || config.port || 4000;

if (logFormat){
