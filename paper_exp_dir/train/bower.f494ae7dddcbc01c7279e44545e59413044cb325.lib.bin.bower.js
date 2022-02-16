process.bin = process.title = 'bower';

var Q = require('q');
var mout = require('mout');
var Logger = require('bower-logger');
var userHome = require('user-home');
var bower = require('../');
var version = require('../version');
var cli = require('../util/cli');
var rootCheck = require('../util/rootCheck');

var options;
var renderer;
var loglevel;
var command;
var commandFunc;
var logger;
var levels = Logger.LEVELS;

options = cli.readOptions({
'version': { type: Boolean, shorthand: 'v' },
'help': { type: Boolean, shorthand: 'h' },
'allow-root': { type: Boolean }
});


if (options.version) {
process.stdout.write(version + '\n');
process.exit();
}


rootCheck(options, bower.config);


if (bower.config.silent) {
loglevel = levels.error;
} else if (bower.config.verbose) {
loglevel = -Infinity;
Q.longStackSupport = true;
} else if (bower.config.quiet) {
loglevel = levels.warn;
} else {
loglevel = levels[bower.config.loglevel] || levels.info;
}


while (options.argv.remain.length) {
command = options.argv.remain.join(' ');


if (bower.abbreviations[command]) {
command = bower.abbreviations[command].replace(/\s/g, '.');
break;
}

command = command.replace(/\s/g, '.');


if (mout.object.has(bower.commands, command)) {
break;
}

options.argv.remain.pop();
}


commandFunc = command && mout.object.get(bower.commands, command);
command = command && command.replace(/\./g, ' ');



if (!commandFunc) {
logger = bower.commands.help();
command = 'help';


} else if (options.help || !commandFunc.line) {
logger = bower.commands.help(command);
command = 'help';

} else {
logger = commandFunc.line(process.argv);



if (!logger) {
logger = bower.commands.help(command);
command = 'help';
}
}


renderer = cli.getRenderer(command, logger.json, bower.config);

function handleLogger(logger, renderer) {
logger
.on('end', function (data) {
if (!bower.config.silent && !bower.config.quiet) {
renderer.end(data);
}
})
.on('error', function (err)  {
if (command !== 'help' && err.code === 'EREADOPTIONS') {
logger = bower.commands.help(command);
renderer = cli.getRenderer('help', logger.json, bower.config);
handleLogger(logger, renderer);
} else {
if (levels.error >= loglevel) {
renderer.error(err);
}

process.exit(1);
}
})
.on('log', function (log) {
if (levels[log.level] >= loglevel) {
renderer.log(log);
}
})
.on('prompt', function (prompt, callback) {
renderer.prompt(prompt)
.then(function (answer) {
callback(answer);
});
});
}

handleLogger(logger, renderer);


if (!userHome) {
logger.warn('no-home', 'HOME environment variable not set. User config will not be loaded.');
}

if (bower.config.interactive) {
var updateNotifier = require('update-notifier');


var notifier = updateNotifier({ pkg: { name: 'bower', version: version } });

if (notifier.update && levels.info >= loglevel) {
notifier.notify();
}
}
