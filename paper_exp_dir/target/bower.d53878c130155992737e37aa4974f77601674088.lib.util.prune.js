dependencyMap[name] = sort(matches, function (a, b) {
if (semver.gt(a.version, b.version)) return -1;
if (semver.lt(a.version, b.version)) return 1;
