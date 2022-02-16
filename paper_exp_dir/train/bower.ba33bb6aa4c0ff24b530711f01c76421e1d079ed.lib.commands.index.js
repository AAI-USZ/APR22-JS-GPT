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

commandLogger.on('end', logger.emit.bind(logger, 'end'));
commandLogger.on('error', logger.emit.bind(logger, 'error'));
}, function (error) {
logger.emit('error', error);
});

return logger;
}

function runFromArgv() {
return require(id).line.apply(undefined, arguments);
}

command.line = runFromArgv;

return command;
}


module.exports = {
cache: {
clean: lazyRequire('./cache/clean'),
list: lazyRequire('./cache/list')
},
completion: lazyRequire('./completion'),
