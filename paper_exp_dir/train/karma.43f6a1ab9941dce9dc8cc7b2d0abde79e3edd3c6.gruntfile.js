module.exports = function (grunt) {
grunt.initConfig({
pkg: grunt.file.readJSON('package.json'),
pkgFile: 'package.json',
files: {
server: ['lib/**/*.js'],
client: ['client/**/*.js'],
grunt: ['grunt.js', 'tasks/*.js'],
scripts: ['scripts/init-dev-env.js']
},
browserify: {
client: {
files: {
'static/karma.js': ['client/main.js']
}
}
},
test: {
unit: 'mochaTest:unit',
client: 'test/client/karma.conf.js',
e2e: 'cucumberjs:ci'
},
watch: {
client: {
files: '<%= files.client %>',
tasks: 'browserify:client'
}
},
mochaTest: {
options: {
require: [
'babel/register'
],
reporter: 'dot',
ui: 'bdd',
quiet: false,
colors: true
},
unit: {
src: [
'test/unit/mocha-globals.js',
'test/unit/**/*.spec.js'
]
}
},
cucumberjs: {
options: {
steps: 'test/e2e/steps',
format: 'progress',
require: 'test/e2e/support/env.js'
},
all: 'test/e2e/*.feature',
current: {
files: {
src: 'test/e2e/*.feature'
},
options: {
tags: '@current'
}
},
ci: {
files: {
src: 'test/e2e/*.feature'
},
options: {
tags: '~@not-jenkins'
}
}
},
eslint: {
options: {
quiet: true
},
target: [
'<%= files.server %>',
'<%= files.grunt %>',
'<%= files.scripts %>',
'<%= files.client %>',
'static/context.js',
'static/debug.js',
'test/**/*.js',
'gruntfile.js'
]
},
'npm-publish': {
options: {
requires: ['build'],
abortIfDirty: true,
