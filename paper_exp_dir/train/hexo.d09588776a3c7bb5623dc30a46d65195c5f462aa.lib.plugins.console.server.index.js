var express = require('express'),
path = require('path'),
colors = require('colors');

module.exports = function(args, callback){
var config = hexo.config,
log = hexo.log,
route = hexo.route,
processor = hexo.extend.processor;

var app = express(),
port = parseInt(args.p || args.port || config.port, 10) || 4000,
useDrafts = args.d || args.drafts || config.render_drafts || false,
