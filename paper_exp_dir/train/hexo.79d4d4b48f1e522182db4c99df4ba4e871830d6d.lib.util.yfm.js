

var _ = require('lodash'),
yaml = require('yamljs'),
render = require('../render');



var yfm = module.exports = function(source){
var content = source.replace(/^-{3}/, '').split('---');

