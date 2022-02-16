var assert = require('assert');
var path = require('path');

describe('NPM Config on package.json', function () {
function assertCAContents(caData, name) {
var r = /-----BEGIN CERTIFICATE-----[a-zA-Z0-9+\/=\n\r]+-----END CERTIFICATE-----/;

assert(caData, name + ' should be set');
assert(Array.isArray(caData), name + ' should be an array');
assert.equal(2, caData.length);
caData.forEach(function(c, i) {
assert(c.match(r),
name + '[' + i + '] should contain a certificate. Given: ' + JSON.stringify(c));
});
}
