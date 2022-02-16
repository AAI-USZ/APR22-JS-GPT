var _ = require('lodash');
var moment = require('moment');


function transform_default(value){
return value;
}

exports.list_categories = function(categories, options){
if (!options){
options = categories;
categories = this.site.categories;
