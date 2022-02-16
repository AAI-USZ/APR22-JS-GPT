var clc = require('cli-color'),
async = require('async'),
fs = require('fs'),
extend = require('../extend'),
util = require('../util'),
format = require('util').format,
spawn = util.spawn,
gConfig = hexo.config,
defaultRoot = '~/' + gConfig.url.replace(/^https?:\/\

var displayHelp = function(){
