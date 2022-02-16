var _ = require('lodash');

module.exports = function(tags, options){
if (!options){
options = tags;
tags = this.site.tags._createQuery();
}

var options = _.extend({
min_font: 10,
