var cp = require('child_process');
var Q = require('q');
var createError = require('./createError');





function cmd(command, args, options) {
var process,
stderr = '',
stdout = '',
deferred = Q.defer();

process = cp.spawn(command, args, options);
process.stdout.on('data', function (data) { stdout += data.toString(); });
process.stderr.on('data', function (data) { stderr += data.toString(); });



process.on('close', function (code) {
var fullCommand,
error;

if (code) {

if (!Array.isArray(args)) {
args = [];
}

fullCommand = command;
fullCommand += args.length ? ' ' + args.join(' ') : '';


error = createError('Failed to execute "' + fullCommand + '", exit code of #' + code, 'ECMDERR', {
