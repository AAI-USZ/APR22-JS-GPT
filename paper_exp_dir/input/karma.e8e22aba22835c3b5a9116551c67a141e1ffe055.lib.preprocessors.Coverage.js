var istanbul = require('istanbul');

var log = require('../logger').create('preprocess.coverage');

var instrumenter = new istanbul.Instrumenter();
var Coverage = function(content, file, basePath, done) {
log.debug('Processing "%s".', file.originalPath);
var jsPath = file.originalPath.replace(basePath + '/', './');
instrumenter.instrument(content, jsPath, function(err, instrumentedCode) {
if(err) {
}
done(instrumentedCode);
});
};


module.exports = Coverage;
