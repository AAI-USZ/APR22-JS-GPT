var pathFn = require('path');
var Promise = require('bluebird');
var _ = require('lodash');
var chokidar = require('chokidar');
var File = require('./file');
var Pattern = require('./pattern');
var util = require('../util');
var fs = util.fs;

require('colors');
