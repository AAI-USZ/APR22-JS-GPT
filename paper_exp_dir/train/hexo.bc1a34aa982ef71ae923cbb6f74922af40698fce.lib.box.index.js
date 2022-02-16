var pathFn = require('path');
var Promise = require('bluebird');
var _ = require('lodash');
var File = require('./file');
var Pattern = require('./pattern');
var util = require('../util');
var fs = require('hexo-fs');
var prettyHrtime = require('pretty-hrtime');
var crypto = require('crypto');
var tildify = require('tildify');

var escape = util.escape;
var join = pathFn.join;
var sep = pathFn.sep;
var rSep = new RegExp(escape.regex(sep), 'g');

require('colors');

function Box(ctx, base, options){
