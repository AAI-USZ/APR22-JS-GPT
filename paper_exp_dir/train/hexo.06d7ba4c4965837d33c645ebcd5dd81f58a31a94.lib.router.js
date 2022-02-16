var EventEmitter = require('events').EventEmitter;

var Router = module.exports = function(){
this.routes = {};
};

Router.prototype.__proto__ = EventEmitter.prototype;

var format = Router.prototype.format = function(str){
if (str[0] === '/') str = str.substring(1);

var last = str.substr(str.length - 1, 1);
if (!last || last === '/') str += 'index.html';

str = str.replace(/\\/g, '/');

