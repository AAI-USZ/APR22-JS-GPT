var semver = require('semver');
var mout = require('mout');

function maxSatisfying(versions, range, strictMatch) {
var version;
var filteredVersions;


if (semver.valid(range)) {
version = mout.array.find(versions, function (version) {
return version === range;
});
if (version) {
return version;
}
}




