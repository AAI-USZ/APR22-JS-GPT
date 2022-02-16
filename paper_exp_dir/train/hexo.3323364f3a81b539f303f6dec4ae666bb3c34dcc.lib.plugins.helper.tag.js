var _ = require('lodash');
var pathFn = require('path');
var qs = require('querystring');
var util = require('../../util');
var htmlTag = util.html_tag;

function mergeAttrs(options, attrs){
if (options.class){
var classes = options.class;

