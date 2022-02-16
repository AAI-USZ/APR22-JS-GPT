var allTestFiles = [];
var TEST_REGEXP = /test/;

Object.keys(window.__testacular__.files).forEach(function(file) {
if (TEST_REGEXP.test(file)) {
allTestFiles.push(file);
}
});

require.config({

baseUrl: '/base',

