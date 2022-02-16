var util = require('hexo-util');
var vm = require('vm');
var swigFilters = require('swig/lib/filters');
var swigUtils = require('swig/lib/utils');
var swigParser = require('swig/lib/parser');

var moreTag = '<a id="more"></a>';
var moreTagLength = moreTag.length;
var rExcerpt = new RegExp(util.escape.regex(moreTag));
