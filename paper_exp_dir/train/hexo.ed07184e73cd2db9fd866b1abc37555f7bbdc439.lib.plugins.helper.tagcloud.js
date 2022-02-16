var _ = require('lodash');

module.exports = function(tags, options){
if (!options){
options = tags;
tags = this.site.tags._createQuery();
}

var options = _.extend({
min_font: 10,
max_font: 20,
unit: 'px',



amount: 40,
orderby: 'name',
order: 1

}, options);

var min = options.min_font,
max = options.max_font,
orderby = options.orderby,
order = options.order,
unit = options.unit,
root = this.config.root;

if (options.amount) tags = tags.limit(options.amount);

if (orderby === 'random' || orderby === 'rand'){
tags = tags.random();
} else {
tags = tags.sort(orderby, order);
}

var length = tags.length,
result = '';

