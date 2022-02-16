var fs = require('fs');

var pkg = JSON.parse(fs.readFileSync(__dirname + '/../package.json').toString());

exports.VERSION = pkg.version;

exports.DEFAULT_PORT = process.env.PORT || 9876;
exports.DEFAULT_HOSTNAME = process.env.IP || 'localhost';


exports.LOG_DISABLE = 'OFF';
exports.LOG_ERROR   = 'ERROR';
exports.LOG_WARN    = 'WARN';
exports.LOG_INFO    = 'INFO';
exports.LOG_DEBUG   = 'DEBUG';


exports.COLOR_PATTERN = '%[%p [%c]: %]%m';
exports.NO_COLOR_PATTERN = '%p [%c]: %m';


exports.CONSOLE_APPENDER = {
type: 'console',
layout: {
type: 'pattern',
pattern: exports.COLOR_PATTERN
}
};

exports.EXIT_CODE = '\x1FEXIT';
