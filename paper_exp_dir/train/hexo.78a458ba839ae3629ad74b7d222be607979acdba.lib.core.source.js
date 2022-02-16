

var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
_ = require('lodash'),
HexoError = require('../error'),
util = require('../util'),
file = util.file2;

var rTmpFile = /[~%]$/;

var isRunning = false,
isReady = false,
processingFiles = {};

var _getProcessor = function(path){
var tasks = [];

hexo.extend.processor.list().forEach(function(processor){
var match = path.match(processor.pattern);

if (!match) return;

var params = {};

for (var i = 0, len = match.length; i < len; i++){
var name = processor.params[i - 1];
