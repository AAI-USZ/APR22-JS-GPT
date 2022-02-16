module.exports = function(config) {
config.set({

basePath: '../..',

frameworks: ['browserify', 'mocha'],


files: [
'test/client/*.js'
],


exclude: [
],

preprocessors: {
'test/client/*.js': ['browserify']
},
