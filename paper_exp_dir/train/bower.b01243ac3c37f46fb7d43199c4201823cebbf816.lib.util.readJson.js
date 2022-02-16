var path = require('path');
var bowerJson = require('bower-json');
var Q = require('q');








function readJson(file, options) {
options = options || {};


return Q.nfcall(bowerJson.read, file, options)
.spread(function (json, jsonFile) {
var deprecated;

if (options.logger) {
var issues = bowerJson.getIssues(json);
if (issues.warnings.length > 0) {
options.logger.warn('invalid-meta', 'for:' + jsonFile);
}
issues.warnings.forEach(function (warning) {
options.logger.warn('invalid-meta', warning);
});
}

jsonFile = path.basename(jsonFile);
deprecated = jsonFile === 'component.json' ? jsonFile : false;

return [json, deprecated, false];
}, function (err) {

if (err.code === 'ENOENT' && options.assume) {
return [bowerJson.parse(options.assume, options), false, true];
}

err.details = err.message;

if (err.file) {
err.message = 'Failed to read ' + err.file;
err.data = { filename: err.file };
} else {
err.message = 'Failed to read json from ' + file;
}

throw err;
});
}

module.exports = readJson;
