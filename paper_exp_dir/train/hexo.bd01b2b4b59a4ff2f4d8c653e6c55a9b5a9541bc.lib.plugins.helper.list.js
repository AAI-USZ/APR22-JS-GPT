var _ = require('lodash'),
moment = require('moment'),


transform_default = function(value) { return value; };

exports.list_categories = function(categories, options){
if (!options){
options = categories;
categories = this.site.categories;
}

