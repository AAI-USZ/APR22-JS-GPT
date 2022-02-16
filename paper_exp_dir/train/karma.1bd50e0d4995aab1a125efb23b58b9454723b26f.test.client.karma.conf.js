module.exports = function(config) {
config.set({

basePath: '../..',

frameworks: ['jasmine', 'commonjs'],


files: [
'client/*.js',
'test/client/*.js'
],


exclude: [
'client/main.js'
],

preprocessors: {
'client/*.js': ['commonjs'],
