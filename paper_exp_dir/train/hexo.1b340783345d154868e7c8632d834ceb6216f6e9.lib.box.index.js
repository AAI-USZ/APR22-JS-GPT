var pathFn = require('path');
var Promise = require('bluebird');
var _ = require('lodash');
var File = require('./file');
var Pattern = require('./pattern');
var util = require('../util');
var fs = require('hexo-fs');
var prettyHrtime = require('pretty-hrtime');
var crypto = require('crypto');

var escape = util.escape;
var join = pathFn.join;

