
var JSHINT_BROWSER = {
browser: true,
es5: true
};

var JSHINT_NODE = {
node: true,
es5: true
};

module.exports = function(grunt) {


grunt.initConfig({
files: {
server: ['lib/*.js'],
client: ['static/testacular.src.js'],
jasmine: ['adapter/jasmine.src.js'],
mocha: ['adapter/mocha.src.js'],
ngScenario: ['adapter/angular-scenario.src.js'],
grunt: ['grunt.js', 'tasks/*.js']
},

lint: {
server: '<config:files.server>',
client: '<config:files.client>',
jasmine: '<config:files.jasmine>',
mocha: '<config:files.mocha>',
ngScenario: '<config:files.ngScenario>',
