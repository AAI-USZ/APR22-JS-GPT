var _ = require('lodash'),
ExtendError = require('../error').ExtendError;

var placeholder = String.fromCharCode(65535),
rPlaceholder = new RegExp(placeholder + '(\\d+)' + placeholder, 'g');



var Tag = module.exports = function(){


this.store = [];
};
