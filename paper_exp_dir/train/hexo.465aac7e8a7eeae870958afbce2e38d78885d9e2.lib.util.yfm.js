



var _ = require('lodash'),
yaml = require('yamljs'),
escape = require('./escape').yaml;

var rYFM = /^(-{3,}\n+)?([\s\S]+?)-{3,}\n{0,}([\s\S]*)/;

var yfm = module.exports = function(str){
return parse(str);
};



var parse = yfm.parse = function(str){
if (!rYFM.test(str)){
