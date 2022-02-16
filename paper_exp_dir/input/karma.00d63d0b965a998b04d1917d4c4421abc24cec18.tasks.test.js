module.exports = function(grunt) {


grunt.registerMultiTask('test', 'Run tests.', function() {
var specDone = this.async();
var node = require('which').sync('node');
var path = require('path');
var cmd = path.join(__dirname, '..', 'bin', 'karma');

var spawnKarma = function(args, callback) {
grunt.log.writeln(['Running', cmd].concat(args).join(' '));
var child;
if (process.platform === 'win32') {
child = grunt.util.spawn({cmd: node, args: [cmd].concat(args)}, callback);
} else {
child = grunt.util.spawn({cmd: cmd, args: args}, callback);
}
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
};

var exec = function(args, failMsg) {
spawnKarma(args, function(err, result, code) {
if (code) {
console.error(err);
grunt.fail.fatal(failMsg, code);
} else {
specDone();
}
});
};



if (this.target === 'e2e') {
var tests = grunt.file.expand(this.data);
var processToKill;
var args = [
'start', null, '--single-run', '--no-auto-watch'
];

