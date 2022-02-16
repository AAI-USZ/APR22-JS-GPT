var fs = require('graceful-fs'),
pathFn = require('path'),
async = require('async'),
_ = require('lodash'),
chokidar = require('chokidar'),
domain = require('domain'),
EventEmitter = require('events').EventEmitter,
Pattern = require('./pattern'),
HexoError = require('../error'),
util = require('../util'),
file = util.file2,
File = require('./file');



var Box = module.exports = function Box(base, options){

