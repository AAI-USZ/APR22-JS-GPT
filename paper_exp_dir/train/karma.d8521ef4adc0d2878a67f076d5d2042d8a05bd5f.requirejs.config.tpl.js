var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

Object.keys(window.__karma__.files).forEach(function(file) {
if (TEST_REGEXP.test(file)) {

allTestFiles.push(file);
}
});

require.config({

baseUrl: '/base',


