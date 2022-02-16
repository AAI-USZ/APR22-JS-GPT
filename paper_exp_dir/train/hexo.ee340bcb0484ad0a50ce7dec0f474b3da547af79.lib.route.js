var EventEmitter = require('events').EventEmitter,
path = require('path'),
_ = require('underscore'),
store = {},
Route = new EventEmitter();

var format = Route.format = function(str){
if (str.substr(0, 1) === '/') str = str.substring(1);

var last = str.substr(str.length - 1, 1);
if (!last || last === '/') str += 'index.html';

return str;
};

Route.get = function(source){
