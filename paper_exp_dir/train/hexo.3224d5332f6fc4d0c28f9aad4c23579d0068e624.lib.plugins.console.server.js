var express = require('express'),
path = require('path'),
colors = require('colors');

module.exports = function(args, callback){
var config = hexo.config,
log = hexo.log,
route = hexo.route,
processor = hexo.extend.processor;

var app = express(),
serverAddress = args.a || args.address || config.server_address || 'localhost',
port = parseInt(args.p || args.port || config.port, 10) || 4000,
useDrafts = args.d || args.drafts || config.render_drafts || false,
loggerFormat = args.l || args.log,
root = config.root;


if (port > 65535 || port < 1){
port = 4000;
}


