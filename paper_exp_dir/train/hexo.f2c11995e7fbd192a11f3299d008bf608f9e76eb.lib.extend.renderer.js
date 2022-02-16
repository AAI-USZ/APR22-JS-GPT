var ExtendError = require('../error').ExtendError,
pathFn = require('path');

var Renderer = module.exports = function(){
this.store = {};
this.storeSync = {};
};

Renderer.prototype.list = function(sync){
return sync ? this.storeSync : this.store;
