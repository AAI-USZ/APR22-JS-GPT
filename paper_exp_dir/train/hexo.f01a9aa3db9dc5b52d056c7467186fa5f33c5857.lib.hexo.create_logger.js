'use strict';

var bunyan = require('bunyan');
var moment = require('moment');
var chalk = require('chalk');

var dateFormat = 'HH:mm:ss.SSS';

var levelNames = {
10: 'TRACE',
20: 'DEBUG',
30: 'INFO ',
40: 'WARN ',
50: 'ERROR',
60: 'FATAL'
};

var levelColors = {
10: 'gray',
20: 'gray',
30: 'green',
40: 'yellow',
50: 'red',
60: 'magenta'
};

function ConsoleStream(env) {
this.debug = env.debug;
}

ConsoleStream.prototype.write = function(data) {
var level = data.level;
var msg = '';


if (this.debug) {
msg += chalk.gray(moment(data.time).format(dateFormat)) + ' ';
}


msg += chalk[levelColors[level]](levelNames[level]) + ' ';


msg += data.msg + '\n';


if (data.err) {
var err = data.err.stack || data.err.message;
if (err) msg += chalk.gray(err) + '\n';

process.stderr.write(msg);
} else {
process.stdout.write(msg);
}
};
