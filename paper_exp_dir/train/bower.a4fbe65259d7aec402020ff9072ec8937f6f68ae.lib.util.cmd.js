var cp = require('child_process');
var Q = require('q');
var createError = require('./createError');





function cmd(command, args, options) {
var process,
stderr = '',
stdout = '',
deferred = Q.defer();

process = cp.spawn(command, args, options);
