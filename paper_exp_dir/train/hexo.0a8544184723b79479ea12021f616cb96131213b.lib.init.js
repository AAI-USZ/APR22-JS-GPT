var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
_ = require('lodash'),
colors = require('colors'),
Database = require('warehouse'),
moment = require('moment'),
os = require('os'),
Hexo = require('./core'),
HexoError = require('./error'),
Logger = require('./logger'),
Model = require('./model'),
util = require('./util'),
file = util.file2;

var createLogFile = function(path, callback){
var content = [
'date: ' + moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
'argv: ' + process.argv.join(' '),
'os: ' + os.type() + ' ' + os.release() + ' ' + os.platform() + ' ' + os.arch(),
'version:',
'  hexo: ' + hexo.version
];

var versions = process.versions;

for (var i in versions){
content.push('  ' + i + ': ' + versions[i]);
}

content.push('---');

fs.writeFile(path, content.join('\n') + '\n\n', callback);
};

module.exports = function(cwd, args, callback){
var baseDir = cwd,
hexo = global.hexo = new Hexo(baseDir, args, {}),
log = hexo.log;


require('./plugins/swig');
require('./plugins/renderer');


hexo.render = require('./render');


if (!args._test){
var consoleStream = new Logger.stream.Console(log, {
colors: {
create: 'green',
update: 'yellow',
delete: 'red'
}
});

if (args.debug){
consoleStream.setFormat('[:level] ' + ':date'.grey + ' :message');
consoleStream.setHide(9);

var logPath = path.join(baseDir, 'debug.log');

createLogFile(logPath, function(err){
if (err) return log.e(err);

var fileStream = new Logger.stream.File(log, {
path: logPath,
hide: 9
});
});
}
}

var loadScript = function(scriptDir, next) {
fs.exists(scriptDir, function(exist){
if (!exist) return next();

file.list(scriptDir, function(err, files){
if (err) return log.e(HexoError.wrap(err, 'Script load failed'));

files.forEach(function(item){
try {
require(path.join(scriptDir, item));
