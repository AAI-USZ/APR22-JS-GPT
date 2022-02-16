var log = require('./logger').create('launcher');
var baseBrowserDecoratorFactory = require('./launchers/Base').decoratorFactory;


var Launcher = function(emitter, injector) {
var browsers = [];

this.launch = function(names, hostname, port, urlRoot) {
var url = 'http://' + hostname + ':' + port + urlRoot;
var browser;

names.forEach(function(name) {
var locals = {
id: ['value', Launcher.generateId()],
name: ['value', name],
baseBrowserDecorator: ['factory', baseBrowserDecoratorFactory]
};


if (name.indexOf('/') !== -1) {
name = 'Script';
}

try {
browser = injector.createChild([locals], ['launcher:' + name]).get('launcher:' + name);
} catch (e) {
if (e.message.indexOf('No provider for "launcher:' + name + '"') !== -1) {
log.warn('Can not load "%s", it is not registered!\n  ' +
'Perhaps you are missing some plugin?', name);
} else {
log.warn('Can not load "%s"!\n  ' + e.stack, name);
}

return;
}

