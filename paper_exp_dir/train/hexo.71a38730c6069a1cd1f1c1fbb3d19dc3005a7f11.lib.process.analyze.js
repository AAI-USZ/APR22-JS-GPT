var extend = require('../extend'),
util = require('../util'),
titlecase = util.titlecase,
_ = require('underscore'),
config;

var regex = {
excerpt: /<!--\s*more\s*-->/
};

var capitalize = function(str){
