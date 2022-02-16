
var JSHINT_BROWSER = {
browser: true,
es5: true,
strict: false
};

var JSHINT_NODE = {
node: true,
es5: true,
strict: false
};

module.exports = function(grunt) {


grunt.initConfig({
pkg: '<json:package.json>',
files: {
server: ['lib/**/*.js'],
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
grunt: '<config:files.grunt>'
},

build: {
client: '<config:files.client>',
jasmine: '<config:files.jasmine>',
mocha: '<config:files.mocha>',
ngScenario: '<config:files.ngScenario>'
},

test: {
unit: '',
client: 'test/client/testacular.conf.js',
e2e: 'test/e2e/*/testacular.conf.js'
},
jasmine_node: {
projectRoot: 'test/unit',
isVerbose: true,
extensions: 'js|coffee'
},



jshint: {
