var Q = require('q');
var Logger = require('bower-logger');


function lazyRequire(id) {
function command() {
var logger = new Logger();
var commandArgs = arguments;

Q.try(function () {

return require(id).apply(undefined, commandArgs);
})
.done(function (commandLogger) {

commandLogger.pipe(logger);
}, function (error) {
logger.emit('error', error);
});

return logger;
}

function runFromArgv() {
return require(id).line.apply(undefined, arguments);
