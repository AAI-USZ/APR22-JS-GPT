var extend = require('../extend'),
_ = require('underscore');

extend.helper.register('tagcloud', function(tags, options){
var config = hexo.config;

var defaults = {
min_font: 8,
max_font: 22,
unit: 'px',



amount: 40,
orderby: 'name',
order: 1,
exclude: []
};

var options = _.extend(defaults, options),
raw = {},
