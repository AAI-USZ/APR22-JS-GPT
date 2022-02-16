var log = require('./logger').create('launcher');
var baseBrowserDecoratorFactory = require('./launchers/base').decoratorFactory;


var Launcher = function(emitter, injector) {
var browsers = [];
var lastUrl;

var getBrowserById = function(id) {
for (var i = 0; i < browsers.length; i++) {
if (browsers[i].id === id) {
return browsers[i];
}
}

return null;
};

