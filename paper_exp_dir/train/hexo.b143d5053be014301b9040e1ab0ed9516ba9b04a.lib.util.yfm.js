



var _ = require('lodash'),
yaml = require('yamljs'),
moment = require('moment'),
escape = require('./escape').yaml;

var rYFM = /^(-{3,}\s+)?([\s\S]+?)-{3,}\s{0,}([\s\S]*)/;

var yfm = module.exports = function(str){
return parse(str);
};



var parse = yfm.parse = function(str){
