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
