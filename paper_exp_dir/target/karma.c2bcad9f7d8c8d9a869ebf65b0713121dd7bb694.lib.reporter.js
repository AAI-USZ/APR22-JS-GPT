var log = require('./logger').create('reporter');
var MultiReporter = require('./reporters/multi');
var baseReporterDecoratorFactory = require('./reporters/base').decoratorFactory;
