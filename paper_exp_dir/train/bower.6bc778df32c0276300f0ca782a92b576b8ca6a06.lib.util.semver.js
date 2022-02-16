var semver = require('semver');
var mout = require('mout');

function maxSatisfying(versions, range, strictMatch) {
var version;
var filteredVersions;


versions = versions.filter(function(version) {
return semver.valid(version);
});


if (semver.valid(range)) {
version = mout.array.find(versions, function(version) {
return version === range;
});
if (version) {
return version;
}
}

range = typeof range === 'string' ? range.trim() : range;



if (strictMatch) {
filteredVersions = versions.map(function(version) {
return !isPreRelease(version) ? version : null;
});

version = semver.maxSatisfying(filteredVersions, range);
if (version) {
return version;
}
}


return semver.maxSatisfying(versions, range);
}

function maxSatisfyingIndex(versions, range, strictMatch) {
var version = maxSatisfying(versions, range, strictMatch);

if (!version) {
return -1;
}

return versions.indexOf(version);
}

function clean(version) {
var parsed = semver.parse(version);

if (!parsed) {
return null;
}


return (
parsed.version +
(parsed.build.length ? '+' + parsed.build.join('.') : '')
);
}

function isPreRelease(version) {
