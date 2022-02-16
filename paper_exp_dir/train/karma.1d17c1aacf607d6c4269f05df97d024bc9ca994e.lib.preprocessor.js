var fs = require('fs');
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

return function(file, done) {
var preprocessors = [];
var nextPreprocessor = function(content) {
if (!preprocessors.length) {
return fs.writeFile(file.contentPath, content, function() {
done();
});
}

preprocessors.shift()(content, file, nextPreprocessor);
};
