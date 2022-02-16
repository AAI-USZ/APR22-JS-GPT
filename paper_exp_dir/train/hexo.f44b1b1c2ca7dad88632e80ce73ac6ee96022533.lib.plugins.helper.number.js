var _ = require('lodash');

exports.number_format = function(num, options){
var defaults = {
precision: false,
delimiter: ',',
separator: '.'
};

var num = num.toString().split('.'),
