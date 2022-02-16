

module.exports = function (grunt) {

'use strict';

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-simple-mocha');


grunt.initConfig({

jshint: {
files: [
'Gruntfile.js',
'lib/**/*.js'
],
options: {
jshintrc: '.jshintrc'
}
},

simplemocha: {
options: {
reporter: 'spec'
},
full: { src: ['test/runner.js'] },
short: {
options: {
reporter: 'dot'
},
src: ['test/runner.js']
},
build: {
options: {
reporter: 'tap'
},
src: ['test/runner.js']
}

},

