var allTestFiles = [];
var TEST_REGEXP = /test\.js$/;

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


});
