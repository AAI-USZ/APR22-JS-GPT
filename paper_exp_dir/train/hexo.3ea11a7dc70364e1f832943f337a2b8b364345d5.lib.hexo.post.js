var moment = require('moment');
var swig = require('swig');
var Promise = require('bluebird');
var pathFn = require('path');
var _ = require('lodash');
var yaml = require('js-yaml');
var util = require('hexo-util');
var fs = require('hexo-fs');
var yfm = require('hexo-front-matter');
var vm = require('vm');
var swigFilters = require('swig/lib/filters');
var swigUtils = require('swig/lib/utils');
var swigParser = require('swig/lib/parser');

var slugize = util.slugize;
var escapeRegExp = util.escapeRegExp;

var rEscapeContent = /<escape(?:[^>]*)>([\s\S]*?)<\/escape>/g;
var rSwigVar = /\{\{[\s\S]*?\}\}/g;
