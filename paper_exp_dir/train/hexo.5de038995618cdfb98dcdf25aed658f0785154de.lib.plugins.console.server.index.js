var express = require('express'),
path = require('path'),
colors = require('colors'),
async = require('async'),
_ = require('lodash'),
Controller = require('./controllers');

var config = hexo.config,
log = hexo.log,
model = hexo.model,
route = hexo.route,
publicDir = hexo.public_dir;

