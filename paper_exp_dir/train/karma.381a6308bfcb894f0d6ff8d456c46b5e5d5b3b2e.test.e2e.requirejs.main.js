var allTestFiles = [];
var TEST_REGEXP = /test\.js$/;

Object.keys(window.__karma__.files).forEach(function(file) {
if (TEST_REGEXP.test(file)) {
allTestFiles.push(file);
}
});

require.config({

baseUrl: '/base',


shim: {
'/base/shim.js': {
exports: 'global'
}
},


deps: allTestFiles,


callback: window.__karma__.start
});
