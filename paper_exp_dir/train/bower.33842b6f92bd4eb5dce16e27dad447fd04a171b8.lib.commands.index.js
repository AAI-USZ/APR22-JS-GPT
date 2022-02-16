var Q = require('q');
var Logger = require('bower-logger');


function commandFactory(id) {
if (process.env.STRICT_REQUIRE) {
require(id);
}

function command() {
var commandArgs = [].slice.call(arguments);

return withLogger(function (logger) {
commandArgs.unshift(logger);
return require(id).apply(undefined, commandArgs);
});
}

function runFromArgv(argv) {
return withLogger(function (logger) {
return require(id).line.call(undefined, logger, argv);
});
}

function withLogger(func) {
var logger = new Logger();

Q.try(func, logger)
.done(function () {
var args = [].slice.call(arguments);
args.unshift('end');
logger.emit.apply(logger, args);
}, function (error) {
logger.emit('error', error);
});

return logger;
}

command.line = runFromArgv;
return command;
}


module.exports = {
cache: {
clean: commandFactory('./cache/clean'),
list: commandFactory('./cache/list'),
},
help: commandFactory('./help'),
home: commandFactory('./home'),
info: commandFactory('./info'),
init: commandFactory('./init'),
install: commandFactory('./install'),
link: commandFactory('./link'),
list: commandFactory('./list'),
lookup: commandFactory('./lookup'),
prune: commandFactory('./prune'),
register: commandFactory('./register'),
