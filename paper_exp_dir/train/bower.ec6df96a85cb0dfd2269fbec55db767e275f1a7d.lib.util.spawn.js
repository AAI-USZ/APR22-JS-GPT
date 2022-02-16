







var spawn = require('child_process').spawn;






module.exports = function (command, args, options, emitter) {
var cp = spawn(command, args, options);
var stderr = '';

cp.stderr.on('data', function (data) {
stderr += data;
});

cp.on('exit', function (code) {
if (code && (!options || !options.ignoreCodes || options.ignoreCodes.indexOf(code) === -1)) {
cp.removeAllListeners();
var err = new Error('status code of ' + command + ': ' + code);
err.details = stderr;
err.command = command;
err.code = code;
emitter.emit('error', err);
}
});

return cp;
};
