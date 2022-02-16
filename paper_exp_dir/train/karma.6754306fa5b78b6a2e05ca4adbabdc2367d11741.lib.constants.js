var fs = require('fs');

var pkg = JSON.parse(fs.readFileSync(__dirname + '/../package.json').toString());

exports.VERSION = pkg.version;

exports.DEFAULT_PORT = 9876;
exports.DEFAULT_RUNNER_PORT = 9100;


exports.LOG_DISABLE = 'OFF';
exports.LOG_ERROR   = 'ERROR';
exports.LOG_WARN    = 'WARN';
exports.LOG_INFO    = 'INFO';
exports.LOG_DEBUG   = 'DEBUG';


exports.COLOR_PATTERN = '%[%p [%c]: %]%m';
