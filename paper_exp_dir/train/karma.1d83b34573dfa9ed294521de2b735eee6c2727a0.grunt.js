module.exports = function(grunt) {

var BROWSERS = process.env.TRAVIS ? 'Firefox' : 'Chrome,ChromeCanary,Firefox,Opera,Safari,PhantomJS';


grunt.initConfig({
files: {
server: ['lib/*.js'],
client: ['static/testacular.src.js'],
jasmine: ['adapter/jasmine.src.js'],
mocha: ['adapter/mocha.src.js']
},

lint: {
server: '<config:files.server>',
client: '<config:files.client>',
jasmine: '<config:files.jasmine>',
mocha: '<config:files.mocha>'
},

build: {
client: '<config:files.client>',
jasmine: '<config:files.jasmine>',
mocha: '<config:files.mocha>'
},

test: {
unit: 'test/unit',
client: 'test/client/config.js',
e2e: 'test/e2e/*/testacular.conf.js'
},

jshint: {
options: {
curly: true,
eqeqeq: true,
immed: true,
latedef: true,
newcap: true,
noarg: true,
sub: true,
undef: true,
boss: true,
eqnull: true,
node: true,
es5: true
},
globals: {}
}
});




grunt.registerTask('default', 'lint test docs');


grunt.registerMultiTask('build', 'Concat and wrap given files.', function() {
var src = grunt.file.expandFiles(this.data).pop();
var dest = src.replace('src.js', 'js');
var wrapper = src.replace('src.js', 'wrapper');

grunt.file.copy(wrapper, dest, {process: function(content) {
var wrappers = content.split('%CONTENT%\n');
return wrappers[0] + grunt.file.read(src) + wrappers[1];
}});

grunt.log.ok('Created ' + dest);
});


grunt.registerMultiTask('test', 'Run tests.', function() {
var specDone = this.async();


if (this.target === 'e2e') {
var tests = grunt.file.expand(this.data);
var cmd = './bin/testacular';
var args = [null, '--single-run', '--no-auto-watch', '--browsers=' + BROWSERS];

var next = function(err, result, code) {
if (code) {
grunt.fail.fatal('E2E test "' + args[0] + '" failed.', code);
} else {
args[0] = tests.shift();
if (args[0]) {
grunt.log.writeln('Running ' + cmd + args.join(' '));
grunt.utils.spawn({cmd: cmd, args: args}, next).stdout.pipe(process.stdout);
} else {
specDone();
}
}
};

return next();
}



var exec = function(cmd, args, failMsg) {
grunt.utils.spawn({cmd: cmd, args: args}, function(err, result, code) {
if (code) {
grunt.fail.fatal(failMsg, code);
} else {
specDone();
}
}).stdout.pipe(process.stdout);
};

var TASK = {
unit: [
'jasmine-node',
['--coffee', this.data],
'Unit tests failed.'
],

client: [
'testacular',
[this.data, '--single-run', '--no-auto-watch', '--browsers=' + BROWSERS],
'Client unit tests failed.'
]
};

exec.apply(null, TASK[this.target]);
});


