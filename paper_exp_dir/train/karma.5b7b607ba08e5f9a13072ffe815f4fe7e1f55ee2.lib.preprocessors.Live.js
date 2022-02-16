var live = require('LiveScript');
var q    = require('q');

var log  = require('../logger').create('preprocess.ls');

var Live = function(content, file, basePath, done) {
var deferred = q.defer();

log.debug('Processing "%s".', content.file.originalPath);
content.file.path = content.file.originalPath + '-compiled.js';

var processed = null;
