var allTestFiles = [];
var TEST_REGEXP = /test\.js$/;

var pathToModule = function(path) {
return path.replace(/^\/base\
};

Object.keys(window.__karma__.files).forEach(function(file) {
if (TEST_REGEXP.test(file)) {

allTestFiles.push(pathToModule(file));
}
});
