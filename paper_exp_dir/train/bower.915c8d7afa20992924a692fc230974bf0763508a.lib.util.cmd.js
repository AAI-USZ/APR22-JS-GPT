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
stderr += data;
});



process.on('close', function (code) {
var fullCommand;
var error;

if (code) {

if (!Array.isArray(args)) {
args = [];
}

fullCommand = command;
fullCommand += args.length ? ' ' + args.join(' ') : '';


error = createError('Failed to execute "' + fullCommand + '", exit code of #' + code, 'ECMDERR', {
details: stderr,
exitCode: code
});

return deferred.reject(error);
}

return deferred.resolve([stdout, stderr]);
});

return deferred.promise;
}

module.exports = cmd;
