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
var instantiatePreprocessor = function(name) {
try {
preprocessors.push(injector.get('preprocessor:' + name));
} catch (e) {

if (e.message.indexOf('No provider for "preprocessor:' + name + '"') !== -1) {
log.warn('Can not load "%s", it is not registered!\n  ' +
'Perhaps you are missing some plugin?', name);
} else {
log.warn('Can not load "%s"!\n  ' + e.stack, name);
}
}
};
