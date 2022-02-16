module.exports = function(config) {
config.set({
frameworks: ['jasmine'],

files: [
'lib/*.js',
'test/*.js'
],

autoWatch: true,

browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],

reporters: ['dots', 'coverage'],

preprocessors: {
'lib/*.js': 'coverage'
},








coverageReporter: {

type : 'html',
dir : 'coverage/'
},

plugins: [
'karma-jasmine',
'karma-coverage',
'karma-chrome-launcher',
'karma-firefox-launcher'
],
});
};
