var express = require('express'),
path = require('path'),
colors = require('colors'),
fs = require('graceful-fs'),
async = require('async'),
_ = require('lodash'),
stylus = require('stylus'),
nib = require('nib'),
Controller = require('./controllers');

var config = hexo.config,
log = hexo.log,
model = hexo.model,
route = hexo.route,
renderFn = hexo.render,
render = renderFn.render,
renderFile = renderFn.renderFile,
publicDir = hexo.public_dir,
processor = hexo.extend.processor;

module.exports = function(args, callback){
var app = express(),
port = parseInt(args.p || args.port || config.port, 10) || 4000,
useDrafts = args.d || args.drafts || config.render_drafts || false,
loggerFormat = args.l || args.log,
root = config.root,
base = root + '_/';
