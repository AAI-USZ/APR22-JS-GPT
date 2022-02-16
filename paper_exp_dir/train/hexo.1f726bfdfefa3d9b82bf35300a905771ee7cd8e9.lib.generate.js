var config = require('./config'),
log = require('./log'),
render = require('./render'),
file = require('./file'),
theme = require('./theme'),
async = require('async'),
clc = require('cli-color'),
fs = require('graceful-fs'),
ejs = require('ejs'),
path = require('path'),
rimraf = require('rimraf'),
queryEngine = require('query-engine'),
_ = require('underscore');

var site = config;
site.time = new Date();
site.posts = new Posts();
site.pages = new Posts();
site.categories = {};
site.tags = {};

