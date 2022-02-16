var Q = require('q');
var Logger = require('bower-logger');
var config = require('../config');


function commandFactory(id) {
function runApi() {
var command = require(id);
var commandArgs = [].slice.call(arguments);

return withLogger(function(logger) {
commandArgs.unshift(logger);

return command.apply(undefined, commandArgs);
});
}

function runFromArgv(argv) {
var commandArgs;
var command = require(id);

commandArgs = command.readOptions(argv);

return withLogger(function(logger) {
commandArgs.unshift(logger);

return command.apply(undefined, commandArgs);
});
}

function withLogger(func) {
var logger = new Logger();

Q.try(func, logger).done(
function() {
config.restore();
var args = [].slice.call(arguments);
args.unshift('end');
logger.emit.apply(logger, args);
},
function(error) {
config.restore();
logger.emit('error', error);
}
);
