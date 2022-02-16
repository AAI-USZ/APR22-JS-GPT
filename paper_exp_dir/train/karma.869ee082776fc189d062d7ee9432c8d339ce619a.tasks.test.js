module.exports = function(grunt) {
var TRAVIS = process.env.TRAVIS;
var BROWSERS = TRAVIS ? 'Firefox' : 'Chrome';


grunt.registerMultiTask('test', 'Run tests.', function() {
var specDone = this.async();
var node = require('which').sync('node');
var path = require('path');
var cmd = path.join(__dirname, '..', 'bin', 'testacular');

var spawnTestacular = function(args, callback) {
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
