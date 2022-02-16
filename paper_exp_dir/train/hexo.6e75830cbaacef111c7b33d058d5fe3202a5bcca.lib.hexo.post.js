var moment = require('moment');
var swig = require('swig');
var Promise = require('bluebird');
var pathFn = require('path');
var _ = require('lodash');
var yaml = require('js-yaml');
var util = require('../util');

var escape = util.escape;
var yfm = util.yfm;
var fs = util.fs;

var rEscapeContent = /<escape(?:[^>]*)>([\s\S]+?)<\/escape>/g;
var rUnescape = /<hexoescape>(\d+)<\/hexoescape>/g;

