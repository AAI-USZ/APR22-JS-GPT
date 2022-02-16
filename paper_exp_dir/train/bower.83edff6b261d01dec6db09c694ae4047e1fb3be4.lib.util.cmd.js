var cp = require('child_process');
var path = require('path');
var Q = require('q');
var mout = require('mout');
var which = require('which');
var createError = require('./createError');

var winBatchExtensions;
var winWhichCache;
var isWin = process.platform === 'win32';

if (isWin) {
winBatchExtensions = ['.bat', '.cmd'];
winWhichCache = {};
}

function getWindowsCommand(command) {
var fullCommand;
var extension;


if (mout.object.hasOwn(winWhichCache, command)) {
return winWhichCache[command];
}


try {
fullCommand = which.sync(command);
} catch (err) {
return winWhichCache[command] = command;
}

extension = path.extname(fullCommand).toLowerCase();


if (winBatchExtensions.indexOf(extension) === -1) {
return winWhichCache[command] = command;
}

return winWhichCache[command] = fullCommand;
}





function cmd(command, args, options) {
var process;
var stderr = '';
var stdout = '';
var deferred = Q.defer();


if (isWin) {
command = getWindowsCommand(command);
}


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


process.on('error', function (error) {
return deferred.reject(error)
});



process.on('close', function (code) {
var fullCommand;
var error;

if (code) {
