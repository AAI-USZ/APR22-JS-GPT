var async = require('async'),
ExtendError = require('../error').ExtendError;



var Filter = module.exports = function(){


this.store = {};
};



Filter.prototype.list = function(type){
