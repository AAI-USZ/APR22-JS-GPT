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
var nextPreprocessor = function(content) {
if (!preprocessors.length) {
file.contentPath = null;
file.content = content;
return done();
}

preprocessors.shift()(content, file, nextPreprocessor);
};
var instantiatePreprocessor = function(name) {
if (alreadyDisplayedWarnings[name]) {
return;
}

try {
preprocessors.push(injector.get('preprocessor:' + name));
} catch (e) {
if (e.message.indexOf('No provider for "preprocessor:' + name + '"') !== -1) {
log.warn('Can not load "%s", it is not registered!\n  ' +
'Perhaps you are missing some plugin?', name);
} else {
log.warn('Can not load "%s"!\n  ' + e.stack, name);
}

alreadyDisplayedWarnings[name] = true;
}
};



for (var i = 0; i < patterns.length; i++) {
if (mm(file.originalPath, patterns[i])) {
config[patterns[i]].forEach(instantiatePreprocessor);
}
}


preprocessors.push(function(content, file, done) {
file.sha = sha1(content);
done(content);
});

return fs.readFile(file.originalPath, function(err, buffer) {
nextPreprocessor(buffer.toString());
});
};
};
