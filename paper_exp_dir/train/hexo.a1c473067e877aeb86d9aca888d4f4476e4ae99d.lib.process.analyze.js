var extend = require('../extend'),
_ = require('underscore'),
words = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'en', 'for', 'if', 'in', 'of', 'on', 'or', 'the', 'to', 'v', 'v.', 'via', 'vs', 'vs.'],
config;

var regex = {
excerpt: /<!--\s*more\s*-->/
};

var capitalize = function(str){
return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
