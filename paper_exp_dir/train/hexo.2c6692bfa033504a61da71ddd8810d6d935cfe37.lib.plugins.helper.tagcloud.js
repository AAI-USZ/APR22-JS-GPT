var _ = require('lodash');

module.exports = function(tags, options){
if (!options){
options = tags;
tags = this.site.tags;
}

if (!tags.length) return '';

var options = _.extend({
min_font: 10,
max_font: 20,
unit: 'px',



amount: 40,
