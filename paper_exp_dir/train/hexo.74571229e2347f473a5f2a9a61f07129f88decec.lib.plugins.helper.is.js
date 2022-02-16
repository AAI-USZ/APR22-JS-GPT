'use strict';

var util = require('hexo-util');
var escapeRegExp = util.escapeRegExp;

var regexCache = {
home: {},
post: {}
};

