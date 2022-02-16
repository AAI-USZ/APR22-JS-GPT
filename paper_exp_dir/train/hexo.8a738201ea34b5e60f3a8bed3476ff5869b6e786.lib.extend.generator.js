var ExtendError = require('../error').ExtendError;

var num = 0;



var Generator = module.exports = function(){


this.store = {};
};



Generator.prototype.list = function(){
