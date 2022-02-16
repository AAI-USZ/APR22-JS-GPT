var colors = require('colors'),
path = require('path'),
Logger = require('../logger');

module.exports = function(callback){
var logger = hexo.log = new Logger({
levels: {
create: 5,
update: 5,
delete: 5,
skip: 7
}
});

if (hexo.env.silent) return callback();

var consoleStream = new Logger.stream.Console(logger, {
colors: {
create: 'green',
