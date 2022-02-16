

var EventEmitter = require('events').EventEmitter;



var Router = module.exports = function(){
this.routes = {};
};



Router.prototype.__proto__ = EventEmitter.prototype;
