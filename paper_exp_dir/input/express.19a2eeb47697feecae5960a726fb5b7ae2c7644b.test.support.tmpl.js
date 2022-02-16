var fs = require('fs');

var variableRegExp = /\$([0-9a-zA-Z\.]+)/g;

module.exports = function renderFile(fileName, options, callback) {
function onReadFile(err, str) {
if (err) {
callback(err);
return;
}

try {
str = str.replace(variableRegExp, generateVariableLookup(options));
} catch (e) {
err = e;
