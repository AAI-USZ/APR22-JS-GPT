module.exports = function(grunt) {

var exec = require('child_process').exec;
var changelog = require('./lib/changelog');


var DESC = 'Increment version, generate changelog, create tag and push to github.';
grunt.registerTask('bump', DESC, function(type) {

var finish = this.async();
var queue = [];
var next = function() {
var cmd = queue.shift();

if (!cmd) {
return finish();
}

exec(cmd[0], function(err, output) {
if (err) {
return grunt.fail.fatal(err.message.replace(/\n$/, '.'));
}
if (cmd[1]) {
grunt.log.ok(cmd[1]);
}
if (cmd[2]) {
cmd[2](output);
}
next();
});
};

var run = function(cmd, msg, fn) {
queue.push([cmd, msg, fn]);
};



var pkg = grunt.file.readJSON(grunt.config('pkgFile'));
var previousVersion = pkg.version;
var minor = parseInt(previousVersion.split('.')[1], 10);
var branch = (minor % 2) ? 'master' : 'stable';
var newVersion = pkg.version = bumpVersion(previousVersion, type);


grunt.file.write(grunt.config('pkgFile'), JSON.stringify(pkg, null, '  ') + '\n');
grunt.log.ok('Version bumped to ' + newVersion);


changelog.generate('v' + newVersion).then(function(data) {
