module.exports = function(config) {
config.set({
frameworks: ['qunit'],

files: [
'lib/*.js',
'test/*.js'
],

autoWatch: true,

browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],

reporters: ['progress', 'coverage'],

preprocessors: {
'lib/*.js': 'coverage'
},








coverageReporter: {

type : 'html',
dir : 'coverage/'
},

plugins: [
'karma-qunit',
'karma-coverage',
'karma-chrome-launcher',
'karma-firefox-launcher'
],
});
};
