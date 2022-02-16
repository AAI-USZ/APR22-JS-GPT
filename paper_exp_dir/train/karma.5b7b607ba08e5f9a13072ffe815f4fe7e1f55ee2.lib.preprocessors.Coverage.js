var istanbul = require('istanbul');
var q        = require('q');

var log      = require('../logger').create('preprocess.coverage');

var instrumenter = new istanbul.Instrumenter({embedSource: true});
var Coverage = function(content) {
var deferred = q.defer();

log.debug('Processing "%s".', content.file.originalPath);
var jsPath = content.file.originalPath.replace(content.basePath + '/', './');
log.debug(content.value.substring(0,20));
