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
if (issues.warnings.length > 0){
options.logger.warn('invalid-meta', 'for:' + jsonFile);
}
issues.warnings.forEach(function (warning) {
options.logger.warn('invalid-meta', warning);
});
}

jsonFile = path.basename(jsonFile);
deprecated = jsonFile === 'component.json' ? jsonFile : false;
