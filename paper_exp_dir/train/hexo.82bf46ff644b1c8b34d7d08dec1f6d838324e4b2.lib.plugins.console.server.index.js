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
