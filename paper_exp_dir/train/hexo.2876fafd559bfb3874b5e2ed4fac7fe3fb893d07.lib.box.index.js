var pathFn = require('path');
var Promise = require('bluebird');
var _ = require('lodash');
var File = require('./file');
var util = require('hexo-util');
var fs = require('hexo-fs');
var prettyHrtime = require('pretty-hrtime');
var crypto = require('crypto');
var chalk = require('chalk');

var Pattern = util.Pattern;
var escape = util.escape;
var join = pathFn.join;
var sep = pathFn.sep;

function Box(ctx, base, options){
this.options = _.extend({
persistent: true,
