realGlob(pattern, options, function(err, results) {
done(err, results.map(util.normalizeWinPath));
});
