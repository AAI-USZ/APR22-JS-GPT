var extend = require('../extend'),
_ = require('underscore');

extend.helper.register('tagcloud', function(){
return function(tags, options){
var config = hexo.config;

var defaults = {
min_font: 8,
max_font: 22,
unit: 'px',



amount: 40,
