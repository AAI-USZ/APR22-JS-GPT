var log = require('./logger').create('launcher');
var baseBrowserDecoratorFactory = require('./launchers/Base').decoratorFactory;


var Launcher = function(emitter, injector) {
var browsers = [];
