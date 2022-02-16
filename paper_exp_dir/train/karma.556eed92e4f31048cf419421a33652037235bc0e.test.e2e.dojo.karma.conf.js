module.exports = function(config) {
config.set({

basePath: '',

frameworks: ['jasmine', 'dojo'],


files: [
'main.js',


{pattern: '*.js', included: false}
],




reporters: ['dots'],



port: 9876,



runnerPort: 9100,



colors: true,




logLevel: config.LOG_INFO,



autoWatch: true,









browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],




singleRun: false,

plugins: [
'karma-dojo',
'karma-jasmine',
'karma-chrome-launcher',
'karma-firefox-launcher'
]
});
};
