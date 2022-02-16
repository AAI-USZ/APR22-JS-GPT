var _ = require('lodash'),
ExtendError = require('../error').ExtendError;



var Console = module.exports = function(){


this.store = {};


this.alias = {};
};



Console.prototype.get = function(name){
