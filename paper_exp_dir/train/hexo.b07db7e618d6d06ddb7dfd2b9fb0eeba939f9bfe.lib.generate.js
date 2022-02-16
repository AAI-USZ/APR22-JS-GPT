var generator = require('./extend').generator.list(),
article = require('./article'),
theme = require('./theme'),
util = require('./util'),
file = util.file,
async = require('async'),
fs = require('fs'),
path = require('path'),
rimraf = require('rimraf'),
_ = require('underscore');

var site = {
time: new Date(),
posts: new Posts(),
