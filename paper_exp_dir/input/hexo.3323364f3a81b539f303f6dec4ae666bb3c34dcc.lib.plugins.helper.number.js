var _ = require('lodash');

exports.number_format = function(num, options){
options = _.extend({
precision: false,
delimiter: ',',
separator: '.'
}, options);


