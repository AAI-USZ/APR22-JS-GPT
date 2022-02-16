var _ = require('lodash'),
moment = require('moment');

exports.list_categories = function(categories, options){
if (!options){
options = categories;
categories = this.site.categories;
}

