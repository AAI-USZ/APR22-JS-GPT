


module.exports = function(karma) {
karma.configure({

basePath: '',

frameworks: ['jasmine', 'requirejs'],


files: [
'main.js',


{pattern: '*.js', included: false}
],




reporters: ['dots'],



port: 9876,



runnerPort: 9100,



colors: true,




logLevel: karma.LOG_INFO,



autoWatch: true,









browsers: ['Chrome'],




singleRun: false,

plugins: [
'karma-requirejs',
'karma-jasmine',
'karma-chrome-launcher',
'karma-firefox-launcher'
],
});
};
