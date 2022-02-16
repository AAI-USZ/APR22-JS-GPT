


module.exports = function(config) {
config.set({


basePath: '%BASE_PATH%',



frameworks: [%FRAMEWORKS%],



files: [
%FILES%
],



exclude: [
%EXCLUDE%
],




reporters: ['progress'],



port: 9876,



colors: true,




logLevel: config.LOG_INFO,



autoWatch: %AUTO_WATCH%,










browsers: [%BROWSERS%],



captureTimeout: 60000,




singleRun: false
});
};
