

var vm = require('vm');
var fs = require('fs');


exports.loadFile = function(path, mocks) {
mocks = mocks || {};

var exports = {};
var context = {
require: function(name) {
return mocks[name] || require(name);
},
console: console,
exports: exports,
module: {
exports: exports
}
};

vm.runInNewContext(fs.readFileSync(path), context);
return context;
};




