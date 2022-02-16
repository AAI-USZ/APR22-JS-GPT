var cp = require('child_process');
var Q = require('q');
var createError = require('./createError');





function cmd(command, args, options) {
var process;
var stderr = '';
var stdout = '';
var deferred = Q.defer();


process = cp.spawn(command, args, options);
process.stdout.on('data', function (data) {
data = data.toString();
deferred.notify(data);
stdout += data;
});
process.stderr.on('data', function (data) {
data = data.toString();
deferred.notify(data);
