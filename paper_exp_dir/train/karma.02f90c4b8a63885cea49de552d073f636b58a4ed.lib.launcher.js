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
