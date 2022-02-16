module.exports = function(karma) {
karma.configure({

basePath: '../..',

frameworks: ['jasmine'],


files: [
'test/client/mocks.js',
'static/karma.src.js',
'test/client/*.spec.js'
],


