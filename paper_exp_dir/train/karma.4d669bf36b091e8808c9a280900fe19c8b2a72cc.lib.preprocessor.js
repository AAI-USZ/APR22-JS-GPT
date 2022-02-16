var fs = require('graceful-fs');
var crypto = require('crypto');
var mm = require('minimatch');

var log = require('./logger').create('preprocess');

var sha1 = function(data) {
var hash = crypto.createHash('sha1');
hash.update(data);
return hash.digest('hex');
};


var createPreprocessor = function(config, basePath, injector) {
var patterns = Object.keys(config);
var alreadyDisplayedWarnings = Object.create(null);

return function(file, done) {
var preprocessors = [];
var nextPreprocessor = function(error, content) {

if (arguments.length === 1 && typeof error === 'string') {
content = error;
error = null;
}

if (error) {
file.content = null;
file.contentPath = null;
return done(error);
}
