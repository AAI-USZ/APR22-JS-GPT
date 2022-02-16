var EventEmitter = require('events').EventEmitter;



var Router = module.exports = function(){


this.routes = {};
};

Router.prototype.__proto__ = EventEmitter.prototype;



var format = Router.prototype.format = function(str){
if (str == null){
str = '';
} else if (typeof str !== 'string'){
str = str + '';
}

str = str
.replace(/^\/+/, '')
.replace(/\\/g, '/')
.replace(/\?.*$/, '');
