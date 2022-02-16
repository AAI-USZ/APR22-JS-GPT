var extend = require('../../extend'),
_ = require('lodash'),
config = hexo.config;

extend.helper.register('tagcloud', function(tags, options){
var defaults = {
min_font: 10,
max_font: 20,
unit: 'px',


