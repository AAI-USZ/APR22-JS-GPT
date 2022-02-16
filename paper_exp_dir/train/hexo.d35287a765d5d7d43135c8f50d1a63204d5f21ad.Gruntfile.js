module.exports = function(grunt){
grunt.initConfig({
mocha: {
lib: {
options: {
reporter: 'dot'
},
src: ['test/**/*.test.js']
}
},
watch: {
mocha: {
files: ['lib/**/*.js', 'test/**/*.test.js'],
tasks: ['mocha:lib']
},
jshint: {
files: ['lib/**/*.js'],
tasks: ['jshint:lib']
}
},
