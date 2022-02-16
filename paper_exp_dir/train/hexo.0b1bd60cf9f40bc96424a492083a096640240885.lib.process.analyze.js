var extend = require('../extend'),
util = require('../util'),
titlecase = util.titlecase,
Taxonomy = require('../model').Taxonomy,
_ = require('underscore'),
config;

var regex = {
excerpt: /<!--\s*more\s*-->/
};

var capitalize = function(str){
return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
