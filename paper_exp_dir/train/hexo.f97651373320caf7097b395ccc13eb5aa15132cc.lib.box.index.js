'use strict';

var pathFn = require('path');
var Promise = require('bluebird');
var _ = require('lodash');
var File = require('./file');
var util = require('hexo-util');
var fs = require('hexo-fs');
var chalk = require('chalk');
var EventEmitter = require('events').EventEmitter;

var Pattern = util.Pattern;
var join = pathFn.join;
var sep = pathFn.sep;

var defaultPattern = new Pattern(function() {
return {};
});

