var _ = require('lodash'),
colors = require('colors'),
moment = require('moment'),
Stream = require('./stream');



var Console = module.exports = function(logger, options){
options = options || {};

Stream.call(this, logger, options);



this.format = options.format || '[:level] :message';



this.colors = _.extend({
error: 'red',
warn: 'yellow',
info: 'green',
debug: 'grey'
}, options.colors);
};

Console.prototype.__proto__ = Stream.prototype;



Console.prototype._write = function(data){
var message = '';

if (data.error){
var err = data.error;
message = err.name + ': ' + err.message + '\n' + err.stack.grey + '\n' + data.message;
} else {
message = data.message;
}

var str = this.format
