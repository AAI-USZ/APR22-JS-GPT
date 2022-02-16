var moment = require('moment'),
fs = require('graceful-fs'),
Stream = require('./stream'),
os = require('os');



var File = module.exports = function(logger, options){
if (!options.path) throw new Error('options.path is not defined');

options = options || {};

Stream.call(this, logger, options);

this.format = options.format || '[:level] :date :message';
var stream = this.stream = fs.createWriteStream(options.path, {flags: 'a'});

stream.on('error', function(err){
if (err) throw err;
});
};

File.prototype.__proto__ = Stream.prototype;



File.prototype._write = function(data){
this.stream.write(toString(this.format, data) + '\n');
};



var toString = function(format, data){
var message = '';

if (data.error){
var err = data.error;
message = err.name + ': ' + err.message + '\n' + err.stack + '\n' + data.message.replace(/\u001b\[(\d+(;\d+)*)?m/g, '');
} else {
message = data.message;
}

return format
